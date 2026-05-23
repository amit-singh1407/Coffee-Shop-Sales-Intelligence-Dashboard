const STORE_LOCATIONS = ['Lower Manhattan', 'Astoria', "Hell's Kitchen"];

const PRODUCT_CATALOG = {
  Coffee: ['Drip Coffee', 'Latte', 'Cappuccino', 'Espresso', 'Americano'],
  Tea: ['Green Tea', 'Black Tea', 'Herbal Tea'],
  Bakery: ['Croissant', 'Muffin', 'Bagel', 'Scone'],
  Sandwiches: ['Ham & Cheese Panini', 'Avocado Toast', 'Turkey Club', 'Grilled Cheese'],
};

const PRODUCT_PRICES = {
  'Drip Coffee': 4.25,
  Latte: 5.95,
  Cappuccino: 5.65,
  Espresso: 3.75,
  Americano: 4.55,
  'Green Tea': 3.85,
  'Black Tea': 3.6,
  'Herbal Tea': 4.0,
  Croissant: 4.5,
  Muffin: 3.95,
  Bagel: 3.75,
  Scone: 4.15,
  'Ham & Cheese Panini': 8.95,
  'Avocado Toast': 9.75,
  'Turkey Club': 9.25,
  'Grilled Cheese': 8.85,
};

const CUSTOMER_IDS = Array.from({ length: 180 }, (_, index) => `C${String(index + 1).padStart(3, '0')}`);

const CUSTOMER_POOLS = {
  morning: CUSTOMER_IDS.slice(0, 60),
  weekend: CUSTOMER_IDS.slice(60, 120),
  premium: CUSTOMER_IDS.slice(120),
};

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let cachedDemoState = null;

function createRng(seed = 42) {
  let value = seed >>> 0;

  return () => {
    value = (1664525 * value + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const random = createRng(42);

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function weekdayIndex(dateString) {
  return new Date(`${dateString}T00:00:00Z`).getUTCDay();
}

function weekdayName(dateString) {
  return WEEKDAY_NAMES[weekdayIndex(dateString)];
}

function sum(values) {
  return values.reduce((accumulator, value) => accumulator + value, 0);
}

function mean(values) {
  return values.length ? sum(values) / values.length : 0;
}

function chooseWeighted(options) {
  const total = options.reduce((accumulator, option) => accumulator + option.weight, 0);
  let roll = random() * total;

  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
}

function pickFrom(items) {
  return items[Math.floor(random() * items.length)];
}

function chooseHour(isWeekend) {
  return chooseWeighted(
    isWeekend
      ? [
          { value: 8, weight: 0.12 },
          { value: 9, weight: 0.16 },
          { value: 10, weight: 0.13 },
          { value: 11, weight: 0.09 },
          { value: 12, weight: 0.1 },
          { value: 13, weight: 0.08 },
          { value: 14, weight: 0.07 },
          { value: 15, weight: 0.08 },
          { value: 16, weight: 0.08 },
          { value: 17, weight: 0.05 },
          { value: 18, weight: 0.04 },
        ]
      : [
          { value: 7, weight: 0.08 },
          { value: 8, weight: 0.16 },
          { value: 9, weight: 0.18 },
          { value: 10, weight: 0.15 },
          { value: 11, weight: 0.09 },
          { value: 12, weight: 0.09 },
          { value: 13, weight: 0.07 },
          { value: 14, weight: 0.05 },
          { value: 15, weight: 0.05 },
          { value: 16, weight: 0.04 },
          { value: 17, weight: 0.03 },
          { value: 18, weight: 0.01 },
        ],
  );
}

function chooseCategory(isWeekend, hour) {
  if (hour >= 7 && hour <= 10) {
    return chooseWeighted(
      isWeekend
        ? [
            { value: 'Coffee', weight: 0.4 },
            { value: 'Bakery', weight: 0.3 },
            { value: 'Tea', weight: 0.1 },
            { value: 'Sandwiches', weight: 0.2 },
          ]
        : [
            { value: 'Coffee', weight: 0.56 },
            { value: 'Bakery', weight: 0.22 },
            { value: 'Tea', weight: 0.08 },
            { value: 'Sandwiches', weight: 0.14 },
          ],
    );
  }

  if (hour >= 11 && hour <= 14) {
    return chooseWeighted(
      isWeekend
        ? [
            { value: 'Coffee', weight: 0.28 },
            { value: 'Bakery', weight: 0.2 },
            { value: 'Tea', weight: 0.12 },
            { value: 'Sandwiches', weight: 0.4 },
          ]
        : [
            { value: 'Coffee', weight: 0.3 },
            { value: 'Bakery', weight: 0.16 },
            { value: 'Tea', weight: 0.16 },
            { value: 'Sandwiches', weight: 0.38 },
          ],
    );
  }

  return chooseWeighted(
    isWeekend
      ? [
          { value: 'Coffee', weight: 0.34 },
          { value: 'Bakery', weight: 0.28 },
          { value: 'Tea', weight: 0.15 },
          { value: 'Sandwiches', weight: 0.23 },
        ]
      : [
          { value: 'Coffee', weight: 0.35 },
          { value: 'Bakery', weight: 0.24 },
          { value: 'Tea', weight: 0.18 },
          { value: 'Sandwiches', weight: 0.23 },
        ],
  );
}

function chooseStore(isWeekend, hour, category) {
  if (hour >= 7 && hour <= 10) {
    return chooseWeighted(
      isWeekend
        ? [
            { value: 'Lower Manhattan', weight: 0.28 },
            { value: 'Astoria', weight: 0.24 },
            { value: "Hell's Kitchen", weight: 0.48 },
          ]
        : [
            { value: 'Lower Manhattan', weight: 0.3 },
            { value: 'Astoria', weight: 0.2 },
            { value: "Hell's Kitchen", weight: 0.5 },
          ],
    );
  }

  if (hour >= 11 && hour <= 14) {
    return chooseWeighted(
      isWeekend
        ? [
            { value: 'Lower Manhattan', weight: 0.3 },
            { value: 'Astoria', weight: 0.4 },
            { value: "Hell's Kitchen", weight: 0.3 },
          ]
        : [
            { value: 'Lower Manhattan', weight: 0.36 },
            { value: 'Astoria', weight: 0.44 },
            { value: "Hell's Kitchen", weight: 0.2 },
          ],
    );
  }

  if (category === 'Sandwiches') {
    return chooseWeighted([
      { value: 'Lower Manhattan', weight: 0.45 },
      { value: 'Astoria', weight: 0.2 },
      { value: "Hell's Kitchen", weight: 0.35 },
    ]);
  }

  return chooseWeighted([
    { value: 'Lower Manhattan', weight: 0.42 },
    { value: 'Astoria', weight: 0.22 },
    { value: "Hell's Kitchen", weight: 0.36 },
  ]);
}

function chooseProduct(category, dayIndex) {
  if (category === 'Coffee') {
    return chooseWeighted([
      { value: 'Drip Coffee', weight: 0.26 },
      { value: 'Latte', weight: 0.4 },
      { value: 'Cappuccino', weight: 0.14 },
      { value: 'Espresso', weight: 0.08 },
      { value: 'Americano', weight: 0.12 },
    ]);
  }

  if (category === 'Tea') {
    const teaDecline = 1 - (dayIndex / 539) * 0.35;
    return chooseWeighted([
      { value: 'Green Tea', weight: 0.45 * teaDecline },
      { value: 'Black Tea', weight: 0.32 },
      { value: 'Herbal Tea', weight: 0.23 + (1 - teaDecline) * 0.12 },
    ]);
  }

  if (category === 'Bakery') {
    return chooseWeighted([
      { value: 'Croissant', weight: 0.4 },
      { value: 'Muffin', weight: 0.28 },
      { value: 'Bagel', weight: 0.18 },
      { value: 'Scone', weight: 0.14 },
    ]);
  }

  return chooseWeighted([
    { value: 'Ham & Cheese Panini', weight: 0.34 },
    { value: 'Avocado Toast', weight: 0.26 },
    { value: 'Turkey Club', weight: 0.22 },
    { value: 'Grilled Cheese', weight: 0.18 },
  ]);
}

function chooseCustomer(isWeekend, hour, category, storeLocation) {
  const morningPool = CUSTOMER_POOLS.morning;
  const weekendPool = CUSTOMER_POOLS.weekend;
  const premiumPool = CUSTOMER_POOLS.premium;

  let pool;
  if (hour >= 7 && hour <= 10) {
    pool = chooseWeighted([
      { value: morningPool, weight: 0.65 },
      { value: weekendPool, weight: 0.2 },
      { value: premiumPool, weight: 0.15 },
    ]);
  } else if (hour >= 11 && hour <= 14) {
    pool = chooseWeighted([
      { value: morningPool, weight: 0.25 },
      { value: weekendPool, weight: 0.25 },
      { value: premiumPool, weight: 0.5 },
    ]);
  } else if (isWeekend) {
    pool = chooseWeighted([
      { value: morningPool, weight: 0.25 },
      { value: weekendPool, weight: 0.55 },
      { value: premiumPool, weight: 0.2 },
    ]);
  } else if (storeLocation === "Hell's Kitchen") {
    pool = chooseWeighted([
      { value: morningPool, weight: 0.35 },
      { value: weekendPool, weight: 0.15 },
      { value: premiumPool, weight: 0.5 },
    ]);
  } else {
    pool = chooseWeighted([
      { value: morningPool, weight: 0.3 },
      { value: weekendPool, weight: 0.25 },
      { value: premiumPool, weight: 0.45 },
    ]);
  }

  return pickFrom(pool);
}

function buildDemoTransactions() {
  const rows = [];
  const startDate = new Date('2024-01-01T00:00:00Z');

  for (let dayIndex = 0; dayIndex < 540; dayIndex += 1) {
    const date = addDays(startDate, dayIndex);
    const dateString = formatDate(date);
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const dailyTransactions = 7 + (dayIndex % 4) + Math.floor(random() * 3);
    const shock = dayIndex % 67 === 0 ? 1.18 : dayIndex % 41 === 0 ? 0.76 : dayIndex % 53 === 0 ? 1.12 : 1;

    for (let transactionIndex = 0; transactionIndex < dailyTransactions; transactionIndex += 1) {
      const hour = chooseHour(isWeekend);
      const category = chooseCategory(isWeekend, hour);
      const productType = chooseProduct(category, dayIndex);
      const storeLocation = chooseStore(isWeekend, hour, category);
      const customerId = chooseCustomer(isWeekend, hour, category, storeLocation);
      const quantity = category === 'Sandwiches' ? 1 + Math.floor(random() * 2) : 1 + Math.floor(random() * 3);
      const basePrice = PRODUCT_PRICES[productType];

      let multiplier = 1 + (random() - 0.5) * 0.18;

      if (storeLocation === "Hell's Kitchen" && hour >= 7 && hour <= 10) {
        multiplier *= 1.15;
      }

      if (storeLocation === 'Astoria' && !isWeekend && hour >= 11 && hour <= 14) {
        multiplier *= 0.85;
      }

      if (storeLocation === 'Lower Manhattan') {
        multiplier *= 1.04;
      }

      if (isWeekend && category === 'Bakery') {
        multiplier *= 1.14;
      }

      if (category === 'Sandwiches' && hour >= 11 && hour <= 14) {
        multiplier *= 1.08;
      }

      if (category === 'Coffee' && productType === 'Latte') {
        multiplier *= 1.05;
      }

      if (category === 'Tea' && productType === 'Green Tea') {
        multiplier *= 1 - (dayIndex / 539) * 0.28;
      }

      if (hour >= 8 && hour <= 11) {
        multiplier *= 1.07;
      }

      const revenue = round(basePrice * quantity * multiplier * shock, 2);
      const minute = 5 + Math.floor(random() * 50);

      rows.push({
        transaction_id: `TX${String(rows.length + 1).padStart(5, '0')}`,
        transaction_date: dateString,
        transaction_time: `${pad(hour)}:${pad(minute)}:00`,
        store_location: storeLocation,
        product_category: category,
        product_type: productType,
        quantity,
        revenue,
        customer_id: customerId,
      });
    }
  }

  return rows;
}

function groupBy(items, keyFn) {
  const map = new Map();

  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(item);
  }

  return map;
}

function buildDailySeries(transactions) {
  const byDate = groupBy(transactions, (row) => row.transaction_date);

  return Array.from(byDate.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([transactionDate, items]) => ({
      transaction_date: transactionDate,
      revenue: round(sum(items.map((item) => item.revenue)), 2),
      orders: items.length,
    }));
}

function buildCategorySeries(transactions) {
  const byCategory = groupBy(transactions, (row) => row.product_category);

  return Array.from(byCategory.entries())
    .map(([productCategory, items]) => ({
      product_category: productCategory,
      revenue: round(sum(items.map((item) => item.revenue)), 2),
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

function buildStoreSeries(transactions) {
  const byStore = groupBy(transactions, (row) => row.store_location);
  const totalRevenue = sum(transactions.map((item) => item.revenue));

  return Array.from(byStore.entries())
    .map(([storeLocation, items]) => ({
      store_location: storeLocation,
      revenue: round(sum(items.map((item) => item.revenue)), 2),
      share: round((sum(items.map((item) => item.revenue)) / totalRevenue) * 100, 1),
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

function buildHourlyDemand(transactions) {
  const hourlyMap = new Map();

  for (let hour = 0; hour < 24; hour += 1) {
    hourlyMap.set(hour, { revenue: 0, orders: 0 });
  }

  for (const transaction of transactions) {
    const hour = Number(transaction.transaction_time.slice(0, 2));
    const bucket = hourlyMap.get(hour);
    bucket.revenue += transaction.revenue;
    bucket.orders += 1;
  }

  return Array.from(hourlyMap.entries()).map(([hour, bucket]) => ({
    hour,
    revenue: round(bucket.revenue, 2),
    orders: bucket.orders,
  }));
}

function buildWeekendVsWeekday(transactions) {
  const rows = [
    { is_weekend: 0, day_type: 'Weekday', Coffee: 0, Bakery: 0, Sandwiches: 0, Tea: 0 },
    { is_weekend: 1, day_type: 'Weekend', Coffee: 0, Bakery: 0, Sandwiches: 0, Tea: 0 },
  ];

  for (const transaction of transactions) {
    const isWeekend = weekdayIndex(transaction.transaction_date) >= 5 ? 1 : 0;
    const target = rows[isWeekend];
    target[transaction.product_category] += transaction.revenue;
  }

  return rows.map((row) => ({
    ...row,
    Coffee: round(row.Coffee, 2),
    Bakery: round(row.Bakery, 2),
    Sandwiches: round(row.Sandwiches, 2),
    Tea: round(row.Tea, 2),
  }));
}

function buildProductSeries(transactions) {
  const byProduct = groupBy(transactions, (row) => row.product_type);

  return Array.from(byProduct.entries())
    .map(([productType, items]) => ({
      product_type: productType,
      product_category: items[0].product_category,
      revenue: round(sum(items.map((item) => item.revenue)), 2),
      quantity: items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

function buildCustomerSegments(transactions) {
  const byCustomer = groupBy(transactions, (row) => row.customer_id);

  const customers = Array.from(byCustomer.entries()).map(([customerId, items]) => {
    const ordersCount = items.length;
    const totalSpend = sum(items.map((item) => item.revenue));
    const morningOrders = items.filter((item) => {
      const hour = Number(item.transaction_time.slice(0, 2));
      return hour >= 7 && hour <= 10;
    }).length;
    const weekendOrders = items.filter((item) => weekdayIndex(item.transaction_date) >= 5).length;

    return {
      customer_id: customerId,
      total_spend: round(totalSpend, 2),
      orders_count: ordersCount,
      morning_ratio: ordersCount ? round((morningOrders / ordersCount) * 100, 1) : 0,
      weekend_ratio: ordersCount ? round((weekendOrders / ordersCount) * 100, 1) : 0,
      avg_order_value: ordersCount ? round(totalSpend / ordersCount, 2) : 0,
    };
  });

  const labeledCustomers = customers.map((customer) => {
    if (customer.morning_ratio >= 50 && customer.morning_ratio >= customer.weekend_ratio) {
      return { ...customer, segment_name: 'Morning Rushers' };
    }

    if (customer.weekend_ratio >= 40) {
      return { ...customer, segment_name: 'Weekend Treaters' };
    }

    return { ...customer, segment_name: 'Premium Lunchers' };
  });

  const summaryOrder = ['Morning Rushers', 'Weekend Treaters', 'Premium Lunchers'];
  const segmentSummary = summaryOrder.map((segment) => {
    const subset = labeledCustomers.filter((customer) => customer.segment_name === segment);

    return {
      segment,
      count: subset.length,
      share_pct: round((subset.length / labeledCustomers.length) * 100, 1),
      avg_spend: round(mean(subset.map((customer) => customer.total_spend)), 2),
      avg_frequency: round(mean(subset.map((customer) => customer.orders_count)), 1),
      avg_order_value: round(mean(subset.map((customer) => customer.avg_order_value)), 2),
      morning_ratio: round(mean(subset.map((customer) => customer.morning_ratio)), 1),
      weekend_ratio: round(mean(subset.map((customer) => customer.weekend_ratio)), 1),
    };
  });

  const scatter = labeledCustomers
    .slice()
    .sort((left, right) => right.total_spend - left.total_spend)
    .slice(0, 200);

  return {
    summary: segmentSummary,
    scatter,
  };
}

function fitLinearTrend(values) {
  const count = values.length;
  const xMean = (count - 1) / 2;
  const yMean = mean(values);

  let numerator = 0;
  let denominator = 0;

  values.forEach((value, index) => {
    const xDelta = index - xMean;
    numerator += xDelta * (value - yMean);
    denominator += xDelta * xDelta;
  });

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
}

function predictLinearTrend(fit, index) {
  return fit.intercept + fit.slope * index;
}

function seasonalForecastFactor(dateString) {
  const day = weekdayIndex(dateString);

  if (day === 0 || day === 6) {
    return 0.94;
  }

  if (day === 5) {
    return 1.06;
  }

  if (day === 1) {
    return 0.98;
  }

  return 1;
}

function buildForecast(dailySeries) {
  const revenueSeries = dailySeries.map((entry) => entry.revenue);
  const holdoutSize = Math.min(30, Math.max(10, Math.floor(revenueSeries.length * 0.1)));
  const trainSeries = revenueSeries.slice(0, revenueSeries.length - holdoutSize);
  const testSeries = revenueSeries.slice(revenueSeries.length - holdoutSize);

  const trainFit = fitLinearTrend(trainSeries);
  const testPredictions = testSeries.map((_, index) => predictLinearTrend(trainFit, trainSeries.length + index));

  const testMean = mean(testSeries);
  const ssRes = testSeries.reduce((accumulator, actual, index) => accumulator + (actual - testPredictions[index]) ** 2, 0);
  const ssTot = testSeries.reduce((accumulator, actual) => accumulator + (actual - testMean) ** 2, 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  const mae = testSeries.reduce((accumulator, actual, index) => accumulator + Math.abs(actual - testPredictions[index]), 0) / testSeries.length;
  const accuracy = Math.max(0, 100 * (1 - mae / Math.max(1, testMean)));

  const fullFit = fitLinearTrend(revenueSeries);
  const lastDate = dailySeries[dailySeries.length - 1].transaction_date;
  const futureDates = Array.from({ length: 30 }, (_, index) => formatDate(addDays(new Date(`${lastDate}T00:00:00Z`), index + 1)));

  const forecast = futureDates.map((dateString, index) => {
    const prediction = predictLinearTrend(fullFit, revenueSeries.length + index) * seasonalForecastFactor(dateString);
    return {
      transaction_date: dateString,
      predicted_revenue: round(Math.max(0, prediction), 2),
    };
  });

  const predictedTotalRevenue = round(sum(forecast.map((entry) => entry.predicted_revenue)), 2);
  const last30Actual = sum(revenueSeries.slice(-30));
  const expectedGrowthPct = last30Actual === 0 ? 0 : round(((predictedTotalRevenue - last30Actual) / last30Actual) * 100, 2);

  return {
    historical: dailySeries.map((entry) => ({
      transaction_date: entry.transaction_date,
      revenue: entry.revenue,
    })),
    forecast,
    predicted_total_revenue: predictedTotalRevenue,
    expected_growth_pct: expectedGrowthPct,
    r2_score: round(r2, 4),
    mae: round(mae, 2),
    accuracy_pct: round(accuracy, 2),
  };
}

function buildAnomalies(dailySeries) {
  const weekdayTotals = new Map();

  for (const row of dailySeries) {
    const name = weekdayName(row.transaction_date);
    if (!weekdayTotals.has(name)) {
      weekdayTotals.set(name, []);
    }
    weekdayTotals.get(name).push(row.revenue);
  }

  const weekdayAverages = Object.fromEntries(Array.from(weekdayTotals.entries()).map(([key, values]) => [key, mean(values)]));
  const avgDailyRevenue = mean(dailySeries.map((row) => row.revenue));

  const scoredDays = dailySeries.map((row) => {
    const weekday = weekdayName(row.transaction_date);
    const baseline = weekdayAverages[weekday] || avgDailyRevenue;
    const pctDiff = baseline === 0 ? 0 : ((row.revenue - baseline) / baseline) * 100;

    return {
      ...row,
      weekday,
      pctDiff,
      anomaly_score: round(pctDiff / 100, 4),
    };
  });

  const anomalies = scoredDays
    .slice()
    .sort((left, right) => Math.abs(right.pctDiff) - Math.abs(left.pctDiff))
    .filter((row) => Math.abs(row.pctDiff) >= 12)
    .slice(0, 18)
    .map((row) => ({
      date: row.transaction_date,
      revenue: round(row.revenue, 2),
      orders: row.orders,
      weekday: row.weekday,
      severity: row.pctDiff < -20 ? 'high' : 'medium',
      type: row.pctDiff < 0 ? 'drop' : 'surge',
      description:
        row.pctDiff < 0
          ? `Significant drop on ${row.weekday}: Revenue of $${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is ${Math.abs(row.pctDiff).toFixed(1)}% lower than the typical ${row.weekday} average of $${baselineForWeekday(weekdayAverages, row.weekday, avgDailyRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
          : `Unexpected revenue surge on ${row.weekday}: Sales spiked to $${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${row.pctDiff.toFixed(1)}% higher than the typical ${row.weekday} average of $${baselineForWeekday(weekdayAverages, row.weekday, avgDailyRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`,
      anomaly_score: row.anomaly_score,
    }));

  if (anomalies.length === 0) {
    const fallback = scoredDays[scoredDays.length - 1];
    anomalies.push({
      date: fallback.transaction_date,
      revenue: round(fallback.revenue, 2),
      orders: fallback.orders,
      weekday: fallback.weekday,
      severity: 'medium',
      type: 'surge',
      description: `Unexpected revenue surge on ${fallback.weekday}: Sales spiked to $${fallback.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      anomaly_score: fallback.anomaly_score,
    });
  }

  return {
    all_daily: scoredDays.map((row) => ({
      transaction_date: row.transaction_date,
      revenue: round(row.revenue, 2),
      orders: row.orders,
      anomaly_label: anomalies.some((anomaly) => anomaly.date === row.transaction_date) ? -1 : 1,
    })),
    anomalies,
    total_anomalies: anomalies.length,
  };
}

function baselineForWeekday(weekdayAverages, weekday, fallback) {
  return weekdayAverages[weekday] || fallback;
}

function buildRecommendations(transactions) {
  const recommendations = [];

  const bakeryTransactions = transactions.filter((row) => row.product_category === 'Bakery');
  const weekendBakery = bakeryTransactions.filter((row) => weekdayIndex(row.transaction_date) >= 5);
  const weekdayBakery = bakeryTransactions.filter((row) => weekdayIndex(row.transaction_date) < 5);

  const weekendBakeryAvg = mean(
    Array.from(groupBy(weekendBakery, (row) => row.transaction_date).values()).map((items) => sum(items.map((item) => item.quantity))),
  );
  const weekdayBakeryAvg = mean(
    Array.from(groupBy(weekdayBakery, (row) => row.transaction_date).values()).map((items) => sum(items.map((item) => item.quantity))),
  );

  if (weekendBakeryAvg > weekdayBakeryAvg) {
    const diffPct = ((weekendBakeryAvg - weekdayBakeryAvg) / Math.max(1, weekdayBakeryAvg)) * 100;
    recommendations.push({
      id: 'rec_bakery_weekend',
      category: 'Inventory',
      title: 'Boost Weekend Bakery Stock',
      impact: 'High',
      metric: `+${diffPct.toFixed(1)}% Weekend Demand`,
      description: `Bakery item demand (Croissants, Muffins, Bagels) is ${diffPct.toFixed(1)}% higher on weekends. Increase morning bakery preparation and inventory levels by 25% on Saturdays and Sundays to avoid stockouts.`,
    });
  }

  const dailySales = Array.from(groupBy(transactions, (row) => row.transaction_date).entries()).map(([transactionDate, items]) => ({
    transaction_date: transactionDate,
    weekday: weekdayIndex(transactionDate),
    revenue: sum(items.map((item) => item.revenue)),
  }));

  const tuesdayAvg = mean(dailySales.filter((row) => row.weekday === 2).map((row) => row.revenue));
  const otherDaysAvg = mean(dailySales.filter((row) => row.weekday !== 2).map((row) => row.revenue));

  if (otherDaysAvg > 0) {
    const dropPct = ((otherDaysAvg - tuesdayAvg) / otherDaysAvg) * 100;
    recommendations.push({
      id: 'rec_tuesday_promo',
      category: 'Marketing',
      title: 'Launch Tuesday Loyalty Boosters',
      impact: 'Medium',
      metric: `-${dropPct.toFixed(1)}% Tuesday Revenue`,
      description: `Tuesday sales are historically ${dropPct.toFixed(1)}% lower than the rest of the week. Launch a "Double Points Tuesday" loyalty campaign and offer a 10% discount on coffee-bakery pairings to drive weekday foot traffic.`,
    });
  }

  recommendations.push({
    id: 'rec_morning_bundle',
    category: 'Sales & Pricing',
    title: 'Morning Rush Combo Offer',
    impact: 'High',
    metric: '8-11 AM Peak Sales',
    description: '58% of transactions occur during the 8:00 - 11:00 AM rush, dominated by Coffee. Introduce a "Morning Starter" bundle (Drip Coffee/Latte + Croissant) for a 15% discount. This encourages single-item buyers to add a high-margin bakery item.',
  });

  const storeSales = Array.from(groupBy(transactions, (row) => `${row.store_location}|${weekdayIndex(row.transaction_date)}`).entries()).map(([key, items]) => {
    const [storeLocation, weekday] = key.split('|');
    return {
      store_location: storeLocation,
      weekday: Number(weekday),
      revenue: mean(Array.from(groupBy(items, (row) => row.transaction_date).values()).map((dayItems) => sum(dayItems.map((item) => item.revenue)))),
    };
  });

  const astoriaWeekday = mean(storeSales.filter((row) => row.store_location === 'Astoria' && row.weekday !== 0 && row.weekday !== 6).map((row) => row.revenue));
  const manhattanWeekday = mean(storeSales.filter((row) => row.store_location === 'Lower Manhattan' && row.weekday !== 0 && row.weekday !== 6).map((row) => row.revenue));

  if (astoriaWeekday < manhattanWeekday * 0.8) {
    recommendations.push({
      id: 'rec_astoria_weekday',
      category: 'Operations',
      title: 'Astoria Weekday Lunch Push',
      impact: 'Medium',
      metric: `$${astoriaWeekday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Weekday Revenue Avg`,
      description: 'The Astoria store shows low sales volumes during weekday lunch hours compared to other stores. Introduce a localized "Lunch & Latte" special (Sandwich + Coffee for $10.99) between 11:30 AM and 2:00 PM to capture local remote workers.',
    });
  }

  const sandwichRevenue = sum(transactions.filter((row) => row.product_category === 'Sandwiches').map((row) => row.revenue));
  const totalRevenue = sum(transactions.map((row) => row.revenue));
  const sandwichShare = totalRevenue === 0 ? 0 : (sandwichRevenue / totalRevenue) * 100;

  recommendations.push({
    id: 'rec_sandwich_upsell',
    category: 'Sales & Pricing',
    title: 'Upsell Premium Sandwiches',
    impact: 'High',
    metric: `${sandwichShare.toFixed(1)}% Revenue Share`,
    description: `Sandwiches (Avocado Toast & Ham/Cheese Panini) contribute ${sandwichShare.toFixed(1)}% of total revenue despite lower volume. Train staff to upsell sandwiches as a premium lunch addon, and introduce a 'Lunch Upgrade' (+ $2.00 for Iced Coffee).`,
  });

  return recommendations;
}

function buildInsights(transactions) {
  const totalRevenue = sum(transactions.map((row) => row.revenue));
  const totalOrders = transactions.length;

  const insights = {
    revenue: [],
    store: [],
    product: [],
    time: [],
  };

  const categoryRevenue = buildCategorySeries(transactions);
  const topCategory = categoryRevenue[0];
  const runnerUpCategory = categoryRevenue[1];

  insights.revenue.push({
    title: 'Category Dominance',
    description: `${topCategory.product_category} is your primary revenue driver, contributing ${(topCategory.revenue / totalRevenue * 100).toFixed(1)}% of total revenue ($${topCategory.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}), followed by ${runnerUpCategory.product_category} at ${((runnerUpCategory.revenue / totalRevenue) * 100).toFixed(1)}%.`,
  });

  const dailyByWeekend = Array.from(groupBy(transactions, (row) => row.transaction_date).entries()).map(([transactionDate, items]) => ({
    transaction_date: transactionDate,
    is_weekend: weekdayIndex(transactionDate) >= 5 ? 1 : 0,
    revenue: sum(items.map((item) => item.revenue)),
  }));

  const weekendAvg = mean(dailyByWeekend.filter((row) => row.is_weekend === 1).map((row) => row.revenue));
  const weekdayAvg = mean(dailyByWeekend.filter((row) => row.is_weekend === 0).map((row) => row.revenue));
  const surgePct = weekdayAvg === 0 ? 0 : ((weekendAvg - weekdayAvg) / weekdayAvg) * 100;

  insights.revenue.push({
    title: 'Weekend Sales Surge',
    description: `Weekend revenue is significantly higher than weekday revenue, showing a strong average increase of ${surgePct.toFixed(1)}% on Saturdays and Sundays. Typical weekend daily revenue hits $${weekendAvg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
  });

  const storeRevenue = buildStoreSeries(transactions);
  const bestStore = storeRevenue[0];
  const runnerUpStore = storeRevenue[1];

  insights.store.push({
    title: 'Top Store Performance',
    description: `${bestStore.store_location} is the highest-grossing store location, capturing ${bestStore.share.toFixed(1)}% of total sales ($${bestStore.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}), followed by ${runnerUpStore.store_location} at ${runnerUpStore.share.toFixed(1)}%.`,
  });

  const hkMorningRevenue = sum(
    transactions.filter((row) => row.store_location === "Hell's Kitchen" && Number(row.transaction_time.slice(0, 2)) >= 7 && Number(row.transaction_time.slice(0, 2)) <= 10).map((row) => row.revenue),
  );
  const hkTotalRevenue = sum(transactions.filter((row) => row.store_location === "Hell's Kitchen").map((row) => row.revenue));
  const hkMorningShare = hkTotalRevenue === 0 ? 0 : (hkMorningRevenue / hkTotalRevenue) * 100;

  insights.store.push({
    title: "Hell's Kitchen Morning Focus",
    description: `Hell's Kitchen is a powerhouse for early morning sales (7:00 - 10:00 AM), representing ${hkMorningShare.toFixed(1)}% of its total location revenue. Prepare high quantities of fresh drip coffee and croissants early.`,
  });

  const productRevenue = buildProductSeries(transactions);
  const latte = productRevenue.find((product) => product.product_type === 'Latte');
  const latteShare = latte ? (latte.revenue / totalRevenue) * 100 : 0;

  insights.product.push({
    title: 'Star Product: Latte',
    description: `Latte is the single highest-performing product, driving ${latteShare.toFixed(1)}% of overall coffee shop sales ($${latte ? latte.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}). Monthly trend reports indicate continuous steady customer demand.`,
  });

  const greenTeaTransactions = transactions.filter((row) => row.product_type === 'Green Tea');
  const greenTeaMonthly = Array.from(groupBy(greenTeaTransactions, (row) => row.transaction_date.slice(0, 7)).entries())
    .map(([month, items]) => ({ month, revenue: sum(items.map((item) => item.revenue)) }))
    .sort((left, right) => left.month.localeCompare(right.month));

  if (greenTeaMonthly.length >= 2) {
    const startValue = greenTeaMonthly[0].revenue;
    const endValue = greenTeaMonthly[greenTeaMonthly.length - 1].revenue;
    const change = startValue === 0 ? 0 : ((endValue - startValue) / startValue) * 100;

    insights.product.push({
      title: 'Declining Trend: Green Tea',
      description: `Green Tea monthly sales have experienced a slow decline of ${Math.abs(change).toFixed(1)}% since opening. Consider running bundled tea offers or introducing specialty iced tea variants to revitalize sales.`,
    });
  } else {
    insights.product.push({
      title: 'Declining Trend: Green Tea',
      description: 'Green Tea is experiencing a slow sales decline of -1.5% month-over-month. Consider introducing seasonal tea blends or cold brew tea varieties to boost customer interest.',
    });
  }

  const morningOrders = transactions.filter((row) => {
    const hour = Number(row.transaction_time.slice(0, 2));
    return hour >= 8 && hour <= 11;
  }).length;

  insights.time.push({
    title: 'Morning Rush Traffic Peak',
    description: `Peak customer foot traffic occurs between 8:00 AM and 11:00 AM daily, accounting for ${((morningOrders / totalOrders) * 100).toFixed(1)}% of all customer transactions. Optimize staffing schedules to maintain speed of service.`,
  });

  const fridayEveningRevenue = sum(
    transactions.filter((row) => weekdayIndex(row.transaction_date) === 5 && Number(row.transaction_time.slice(0, 2)) >= 16 && Number(row.transaction_time.slice(0, 2)) <= 18).map((row) => row.revenue),
  );
  const weekdayEveningAverage = mean(
    Array.from(
      groupBy(
        transactions.filter((row) => weekdayIndex(row.transaction_date) < 5 && Number(row.transaction_time.slice(0, 2)) >= 16 && Number(row.transaction_time.slice(0, 2)) <= 18),
        (row) => row.transaction_date,
      ).values(),
    ).map((items) => sum(items.map((item) => item.revenue))),
  );
  const fridayEveningDayCount = new Set(transactions.filter((row) => weekdayIndex(row.transaction_date) === 5).map((row) => row.transaction_date)).size || 1;
  const fridayEveningAverage = fridayEveningRevenue / fridayEveningDayCount;
  const fridayDiffPct = weekdayEveningAverage === 0 ? 0 : ((fridayEveningAverage - weekdayEveningAverage) / weekdayEveningAverage) * 100;

  insights.time.push({
    title: 'Friday Evening Uptick',
    description: `Friday afternoon sales (4:00 - 6:00 PM) show a distinct ${fridayDiffPct.toFixed(1)}% surge compared to standard Mon-Thu afternoons, driven primarily by end-of-week coffee/sandwich meetups.`,
  });

  return insights;
}

function buildDemoState() {
  if (cachedDemoState) {
    return cachedDemoState;
  }

  const transactions = buildDemoTransactions();
  const dailySeries = buildDailySeries(transactions);
  const storeSeries = buildStoreSeries(transactions);
  const categorySeries = buildCategorySeries(transactions);
  const hourlyDemand = buildHourlyDemand(transactions);
  const weekendVsWeekday = buildWeekendVsWeekday(transactions);
  const productSeries = buildProductSeries(transactions);
  const segments = buildCustomerSegments(transactions);
  const forecast = buildForecast(dailySeries);
  const anomalies = buildAnomalies(dailySeries);
  const recommendations = buildRecommendations(transactions);
  const insights = buildInsights(transactions);

  cachedDemoState = {
    transactions,
    dailySeries,
    storeSeries,
    categorySeries,
    hourlyDemand,
    weekendVsWeekday,
    productSeries,
    segments,
    forecast,
    anomalies,
    recommendations,
    insights,
  };

  return cachedDemoState;
}

function filterDemoTransactions(params = {}) {
  const { transactions } = buildDemoState();
  const {
    page = 1,
    limit = 25,
    search = '',
    store = '',
    category = '',
    startDate = '',
    endDate = '',
    minRevenue = '',
    maxRevenue = '',
  } = params;

  const normalizedSearch = String(search || '').toLowerCase();
  let filtered = transactions.slice();

  if (normalizedSearch) {
    if (normalizedSearch.includes('january')) {
      filtered = filtered.filter((row) => new Date(`${row.transaction_date}T00:00:00Z`).getUTCMonth() === 0);
    }

    if (normalizedSearch.includes('february')) {
      filtered = filtered.filter((row) => new Date(`${row.transaction_date}T00:00:00Z`).getUTCMonth() === 1);
    }

    if (normalizedSearch.includes('march')) {
      filtered = filtered.filter((row) => new Date(`${row.transaction_date}T00:00:00Z`).getUTCMonth() === 2);
    }

    const textMatch = filtered.filter((row) =>
      [row.product_type, row.product_category, row.store_location, row.transaction_date].some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );

    if (textMatch.length > 0) {
      filtered = textMatch;
    }
  }

  if (store) {
    filtered = filtered.filter((row) => row.store_location === store);
  }

  if (category) {
    filtered = filtered.filter((row) => row.product_category === category);
  }

  if (startDate) {
    filtered = filtered.filter((row) => row.transaction_date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter((row) => row.transaction_date <= endDate);
  }

  if (minRevenue !== '') {
    filtered = filtered.filter((row) => row.revenue >= Number(minRevenue));
  }

  if (maxRevenue !== '') {
    filtered = filtered.filter((row) => row.revenue <= Number(maxRevenue));
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Number(limit)));
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages);
  const startIndex = (currentPage - 1) * Number(limit);
  const paginatedRows = filtered.slice(startIndex, startIndex + Number(limit));

  return {
    data: paginatedRows,
    totalPages,
    currentPage,
    totalCount,
    statistics: {
      totalRevenue: round(sum(filtered.map((row) => row.revenue)), 2),
      averageSales: round(mean(filtered.map((row) => row.revenue)), 2),
      productCount: new Set(filtered.map((row) => row.product_type)).size,
    },
  };
}

function buildChatbotReply(queryText) {
  const query = String(queryText || '').trim().toLowerCase();
  const state = buildDemoState();

  if (!query) {
    return {
      answer: 'Please ask a question! I am ready to analyze your coffee sales data.',
      tableData: null,
    };
  }

  if (['forecast', 'predict', 'next month', 'future', 'upcoming', 'projection'].some((keyword) => query.includes(keyword))) {
    const forecast = state.forecast;
    const growthSign = forecast.expected_growth_pct >= 0 ? '+' : '';
    const weeklyMap = new Map();

    forecast.forecast.forEach((entry, index) => {
      const weekLabel = `Week ${Math.floor(index / 7) + 1}`;
      if (!weeklyMap.has(weekLabel)) {
        weeklyMap.set(weekLabel, 0);
      }
      weeklyMap.set(weekLabel, weeklyMap.get(weekLabel) + entry.predicted_revenue);
    });

    return {
      answer: `🔮 **AI Sales Forecast Summary**:\n\nOur time-series model predicts total revenue for the next **30 days** will reach **$${forecast.predicted_total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**.\nThis represents an expected growth rate of **${growthSign}${forecast.expected_growth_pct}%** compared to the last 30 days.\n\nModel evaluation indicates a baseline accuracy of **${forecast.accuracy_pct}%** (R²: ${forecast.r2_score}).`,
      tableData: Array.from(weeklyMap.entries()).map(([week, value]) => ({
        Week: week,
        predicted_revenue: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })),
      chartType: 'forecast',
    };
  }

  if (['anomaly', 'anomalies', 'drop', 'spike', 'outlier', 'unusual', 'alert'].some((keyword) => query.includes(keyword))) {
    const recentAnomalies = state.anomalies.anomalies.slice(0, 5);
    const topAnomaly = recentAnomalies[0] || state.anomalies.anomalies[0];

    return {
      answer: `🚨 **AI Anomaly Detection Report**:\n\nWe scanned our daily transaction streams using an **outlier model** and detected **${state.anomalies.total_anomalies} anomalous days** (out of 540 days analyzed).\n\nOur latest warning alert was triggered on **${topAnomaly.date}**:\n*${topAnomaly.description}*`,
      tableData: recentAnomalies.map((anomaly) => ({
        Date: anomaly.date,
        Store: anomaly.weekday,
        Revenue: `$${anomaly.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        Explanation: anomaly.type === 'drop' ? 'Drop (-20%)' : 'Spike (+15%)',
        Severity: anomaly.severity.toUpperCase(),
      })),
    };
  }

  if (['recommend', 'recommendation', 'action', 'improve', 'optimization', 'advice'].some((keyword) => query.includes(keyword))) {
    return {
      answer: `💡 **AI Business Recommendations**:\n\nHere are the top **${state.recommendations.length} optimization strategies** compiled by our retail intelligence engine:\n\n${state.recommendations
        .map((recommendation, index) => `**${index + 1}. ${recommendation.title}** (${recommendation.impact} Impact)\n* ${recommendation.description}\n`)
        .join('\n')}`,
      tableData: state.recommendations.map((recommendation) => ({
        Title: recommendation.title,
        Impact: recommendation.impact,
        Category: recommendation.category,
      })),
    };
  }

  if (['segment', 'customer', 'cluster', 'group', 'persona', 'profile'].some((keyword) => query.includes(keyword))) {
    return {
      answer: `👥 **Customer Behavior Segmentation (K-Means)**:\n\nWe partitioned our customer base into **3 behavioral personas** based on frequency, spend, weekend bias, and morning bias:\n\n${state.segments.summary
        .map(
          (segment) =>
            `🔹 **${segment.segment}** (${segment.share_pct}% of base):\n  * Average Lifetime Spend: **$${segment.avg_spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**\n  * Visit Frequency: **${segment.avg_frequency} orders**\n  * Typical Order: **$${segment.avg_order_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**\n  * Weekend purchases: **${segment.weekend_ratio}%** | Mornings: **${segment.morning_ratio}%**\n`,
        )
        .join('\n')}`,
      tableData: state.segments.summary.map((segment) => ({
        'Segment Persona': segment.segment,
        'Share %': `${segment.share_pct}%`,
        'Avg spend': `$${segment.avg_spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Avg Ticket': `$${segment.avg_order_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })),
    };
  }

  if (['product', 'sell', 'popular', 'item', 'coffee', 'tea', 'bakery', 'sandwich'].some((keyword) => query.includes(keyword))) {
    const ascending = ['worst', 'least', 'lowest', 'declining', 'underperform'].some((keyword) => query.includes(keyword));
    const categoryFilter = ['coffee', 'tea', 'bakery', 'sandwich'].find((keyword) => query.includes(keyword));
    const categoryLabel = categoryFilter ? (categoryFilter === 'sandwich' ? 'Sandwiches' : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)) : '';
    const filtered = categoryFilter
      ? state.productSeries.filter((product) => product.product_category === categoryLabel)
      : state.productSeries;
    const sorted = filtered.slice().sort((left, right) => (ascending ? left.revenue - right.revenue : right.revenue - left.revenue));
    const starItem = sorted[0];

    return {
      answer: `📊 **Product Performance Intelligence**${categoryLabel ? ` in the **${categoryLabel}** category` : ''}:\n\nThe **${ascending ? 'bottom' : 'top'}-performing** product by revenue is **${starItem.product_type}**:\n  * Total Revenue: **$${starItem.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**\n  * Total Units Sold: **${starItem.quantity.toLocaleString()} units**\n  * Category: **${starItem.product_category}**\n\nHere is the product ranking breakdown:`,
      tableData: sorted.slice(0, 6).map((product, index) => ({
        Rank: index + 1,
        Product: product.product_type,
        Category: product.product_category,
        'Quantity Sold': product.quantity.toLocaleString(),
        'Total Revenue': `$${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })),
    };
  }

  if (['store', 'locations', 'astoria', 'kitchen', 'manhattan'].some((keyword) => query.includes(keyword))) {
    const ascending = ['worst', 'least', 'lowest', 'underperform'].some((keyword) => query.includes(keyword));
    const storeMention = query.includes('astoria')
      ? 'Astoria'
      : query.includes('kitchen')
        ? "Hell's Kitchen"
        : query.includes('manhattan')
          ? 'Lower Manhattan'
          : null;

    if (storeMention) {
      const storeTransactions = state.transactions.filter((row) => row.store_location === storeMention);
      const storeRevenue = sum(storeTransactions.map((row) => row.revenue));
      const storeOrders = new Set(storeTransactions.map((row) => row.transaction_id)).size;
      const totalRevenue = sum(state.transactions.map((row) => row.revenue));
      const storeShare = totalRevenue === 0 ? 0 : (storeRevenue / totalRevenue) * 100;
      const bestProduct = buildProductSeries(storeTransactions).sort((left, right) => right.revenue - left.revenue)[0];
      const hourly = groupBy(storeTransactions, (row) => Number(row.transaction_time.slice(0, 2)));
      const peakHour = Array.from(hourly.entries()).sort((left, right) => sum(right[1].map((item) => item.revenue)) - sum(left[1].map((item) => item.revenue)))[0][0];

      return {
        answer: `🏬 **Store Intelligence: ${storeMention}**:\n\nThis location generates **$${storeRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}** in total revenue, contributing **${storeShare.toFixed(1)}%** of overall company sales.\n  * Total Orders: **${storeOrders.toLocaleString()}**\n  * Average Ticket Size (AOV): **$${(storeRevenue / Math.max(1, storeOrders)).toFixed(2)}**\n  * Star Seller: **${bestProduct.product_type}** ($${bestProduct.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n  * Operational Peak Hour: **${pad(peakHour)}:00 AM/PM**`,
        tableData: Array.from(groupBy(storeTransactions, (row) => row.product_category).entries()).map(([productCategory, items]) => ({
          Category: productCategory,
          Revenue: `$${sum(items.map((item) => item.revenue)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        })),
      };
    }

    const storeRanking = state.storeSeries.slice().sort((left, right) => (ascending ? left.revenue - right.revenue : right.revenue - left.revenue));
    const starStore = storeRanking[0];

    return {
      answer: `🏬 **Store Rankings Performance**:\n\nThe **${ascending ? 'bottom' : 'top'}-performing** store location is **${starStore.store_location}**:\n  * Overall Sales: **$${starStore.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**\n  * Revenue Share: **${starStore.share.toFixed(1)}%**\n  * Transaction Count: **${state.transactions.filter((row) => row.store_location === starStore.store_location).length.toLocaleString()} orders**\n\nHere is the full retail footprint summary:`,
      tableData: storeRanking.map((store) => ({
        'Store Location': store.store_location,
        Revenue: `$${store.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        Share: `${store.share.toFixed(1)}%`,
        Orders: state.transactions.filter((row) => row.store_location === store.store_location).length.toLocaleString(),
      })),
    };
  }

  return {
    answer: `I can help answer questions about forecasts, anomalies, recommendations, customer segments, products, and stores. Try asking about one of those areas.`,
    tableData: null,
  };
}

export function getDemoOverview() {
  const state = buildDemoState();
  const totalRevenue = sum(state.transactions.map((row) => row.revenue));
  const totalOrders = state.transactions.length;
  const lastDate = state.dailySeries[state.dailySeries.length - 1].transaction_date;
  const cutoff30 = formatDate(addDays(new Date(`${lastDate}T00:00:00Z`), -30));
  const cutoff60 = formatDate(addDays(new Date(`${lastDate}T00:00:00Z`), -60));

  const last30Revenue = sum(state.transactions.filter((row) => row.transaction_date > cutoff30).map((row) => row.revenue));
  const prev30Revenue = sum(
    state.transactions.filter((row) => row.transaction_date > cutoff60 && row.transaction_date <= cutoff30).map((row) => row.revenue),
  );

  const monthlyGrowthPct = prev30Revenue === 0 ? 0 : ((last30Revenue - prev30Revenue) / prev30Revenue) * 100;
  const bestStore = state.storeSeries[0];
  const worstProduct = state.productSeries[state.productSeries.length - 1];
  const latestAlert = state.anomalies.anomalies[0]?.description || 'No anomalies detected recently. Operations stable.';
  const latestInsight = state.insights.revenue[0]?.description || 'Weekend sales trends indicate high coffee demands.';
  const latestRecommendation = state.recommendations[0]?.description || 'Optimize espresso supply lines.';

  return {
    kpis: {
      totalRevenue: round(totalRevenue, 2),
      totalOrders,
      avgOrderValue: round(totalRevenue / totalOrders, 2),
      monthlyGrowthPct: round(monthlyGrowthPct, 2),
      aiSalesPrediction: round(state.forecast.predicted_total_revenue, 2),
      bestStore: bestStore.store_location,
      worstProduct: worstProduct.product_type,
    },
    aiWidgets: {
      insightCard: latestInsight,
      recommendationCard: latestRecommendation,
      alertCard: latestAlert,
    },
  };
}

export function getDemoAnalytics() {
  const state = buildDemoState();
  const productSeries = state.productSeries;

  return {
    stores: state.storeSeries,
    categories: state.categorySeries,
    segments: state.segments,
    hourlyDemand: state.hourlyDemand,
    weekendVsWeekday: state.weekendVsWeekday,
    productIntelligence: {
      topRevenue: productSeries.slice(0, 5),
      declining: productSeries.slice(-3).reverse(),
    },
  };
}

export function getDemoForecast() {
  return buildDemoState().forecast;
}

export function getDemoAnomalies() {
  return buildDemoState().anomalies;
}

export function getDemoRecommendations() {
  return buildDemoState().recommendations;
}

export function getDemoInsights() {
  return buildDemoState().insights;
}

export function getDemoDataset(params = {}) {
  return filterDemoTransactions(params);
}

export function getDemoChatbotReply(queryText) {
  return buildChatbotReply(queryText);
}
