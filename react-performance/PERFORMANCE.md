# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A
- **Render duration**: 608.1ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/baseline/1. Sort-countries.png>)

### Interaction B: Search countries

- **Commit duration**: N/A
- **Render duration**: 287.5ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/baseline/2. Search-countries.png>)

### Interaction C: Change year

- **Commit duration**: N/A
- **Render duration**: 621.7ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/baseline/3. Change-year.png>)

### Interaction D: Toggle column

- **Commit duration**: N/A
- **Render duration**: 615.4ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/baseline/4. Toggle column.png>)

## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A
- **Render duration**: 16ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/optimized/1. Sort-countries.png>)

### Interaction B: Search countries

- **Commit duration**: N/A
- **Render duration**: 17.5ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/optimized/2. Search-countries.png>)

### Interaction C: Change year

- **Commit duration**: N/A
- **Render duration**: 18.3ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/optimized/3. Change-year.png>)

### Interaction D: Toggle column

- **Commit duration**: N/A
- **Render duration**: 25.3ms
- **Screenshot**: ![screenshot](<performance-starter/screenshots/optimized/4. Toggle column.png>)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------- | -------------- | ----------- |
| Sort countries   | 608.1         | 16             | 97.4%       |
| Search countries | 287.5         | 17.5           | 93.9%       |
| Change year      | 621.7         | 18.3           | 97.1%       |
| Toggle column    | 615.4         | 25.3           | 95.9%       |
| **Average**      | **533.2**     | **19.3**       | **96.4%**   |
