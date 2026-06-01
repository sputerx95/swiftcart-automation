export const testData = {
  baseUrl: "https://swiftcart-sanaev-dev.lovable.app/",
  validUser: {
    email: "demo@swiftcart.com",
    password: "password123"
  },
  invalidUser: {
    email: "demo@swiftcart.com",
    password: "wrongPassword"
  },
  checkout: {
    firstName: "Muhammad",
    lastName: "Sanaev",
    address: "14744 Washington Ave",
    city: "San Leandro",
    state: "CA",
    zip: "94578",
    country: "United States"
  },
  invalidCheckout: {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: ""
  },
  searchQuery: "charger",
  filterCategory: "Chargers"
} as const;
