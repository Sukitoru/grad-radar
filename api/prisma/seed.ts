import { faker } from '@faker-js/faker';

// BLOCK 1: Define the Data Interface
// This TypeScript interface guarantees that every object in our array has the exact 
// structure that Recharts expects when mapping data lines, bars, or scatter plots.
export interface ApplicationData {
  username: string;
  gpa: number;
  gre: number;
  publications: number;
  status: string;
  decisionDate: string;
}

// BLOCK 2: Data Generation Function
// This function accepts a number (e.g., 50) and returns an array of that many mock records.
export const generateRechartsMockData = (numRecords: number): ApplicationData[] => {
  // Initialize the empty array that will hold our dataset
  const chartData: ApplicationData[] = [];

  // BLOCK 3: The Generation Loop
  // This loop runs continuously until 'i' reaches the requested number of records.
  for (let i = 0; i < numRecords; i++) {
    
    // BLOCK 4: Constructing the Data Point
    // We use Faker to generate randomized but realistic numbers for each required field.
    const entry: ApplicationData = {
      // Generates an anonymous/pseudonymous username to keep the data safe
      username: faker.internet.username(), 
      
      // Generates a float for GPA between 2.5 and 4.0 (useful for stat band charts)
      gpa: faker.number.float({ min: 2.5, max: 4.0, fractionDigits: 2 }),
      
      // Generates a GRE score between 260 and 340
      gre: faker.number.int({ min: 260, max: 340 }),
      
      // Generates between 0 and 3 publications
      publications: faker.number.int({ min: 0, max: 3 }),
      
      // Randomly selects if this specific application was accepted, rejected, or waitlisted
      status: faker.helpers.arrayElement(['accepted', 'rejected', 'waitlisted']),
      
      // Generates a date from the last 60 days, formatted as YYYY-MM-DD for timeline plotting
      decisionDate: faker.date.recent({ days: 60 }).toISOString().split('T')[0], 
    };

    // BLOCK 5: Populate the Array
    // Push the newly created entry object into our chartData array.
    chartData.push(entry);
  }

  // BLOCK 6: Return the Data
  // Output the fully populated array so it can be passed directly into a Recharts <LineChart> or <BarChart> data prop.
  return chartData;
};

// Example execution:
const myChartData = generateRechartsMockData(50);
console.log(myChartData);