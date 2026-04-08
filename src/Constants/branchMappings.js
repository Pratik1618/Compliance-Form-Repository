export const branchMappings = [
  {
    state: "Andaman And Nicobar Islands",
    branch: "Chennai",
    address: "No 53 & 55, Station Road, Radha Nagar, Chromepet, Chennai, Tamilnadu 600044",
  },
  {
    state: "Andhra Pradesh",
    branch: "Andhra Pradesh",
    address: "3rd Floor, D No.36-12-4, Surya Prime, Revenue Ward No.20, Innespeta, Rajamahendravaram, East Godavari, Andhra Pradesh 533101",
  },
  {
    state: "Arunachal Pradesh",
    branch: "West Bengal",
    address: "VIP Enclave Phase 2 Block - C, Shop No 28, Ground Floor, Raghunathpur, Kolkata, West Bengal 700059",
  },
  {
    state: "Assam",
    branch: "West Bengal",
    address: "VIP Enclave Phase 2 Block - C, Shop No 28, Ground Floor, Raghunathpur, Kolkata, West Bengal 700059",
  },
  {
    state: "Bihar",
    branch: "Bihar",
    address: "2nd Floor, Rupa Tower, Plot No. 382, RPS More, Bailey Rd, Patna, Bihar 801503",
  },
  {
    state: "Delhi",
    branch: "Delhi",
    address: "4th Floor, Office No. F-405, Aditya Tower, Lakshmi Nagar, New Delhi 110092",
  },
  {
    state: "Gujarat",
    branch: "Gujarat",
    address: "14, 1st Floor, General Bank Chambers, C.G. Road, Ahmedabad, Gujarat 380009",
  },
  {
    state: "Karnataka",
    branch: "Karnataka",
    address: "#25, 1st Main, 3rd A Cross, Domlur 2nd Stage, Bangalore, Karnataka 560071",
  },
  {
    state: "Kerala",
    branch: "Kerala",
    address: "4th Floor, Chemmanam Square, P.P. Road, Perumbavoor, Ernakulam, Kerala 683542",
  },
  {
    state: "Madhya Pradesh",
    branch: "Indore",
    address: "Office No 757, 2nd floor, Mahalaxmi Nagar, Pioneer College Road, Indore, Madhya Pradesh 452010",
  },
  {
    state: "Maharashtra",
    branch: "Mumbai",
    address: "Office No 317, 3rd Floor, BGTA Nilgiri Premises, Wadala Truck Terminal, Mumbai 400037",
  },
  {
    state: "Maharashtra",
    branch: "Pune",
    address: "Parekh Capital, Samrat Garden Road, Hadapsar, Pune, Maharashtra 411028",
  },
  {
    state: "Punjab",
    branch: "Punjab",
    address: "House No.240, Phase XI, Sector 65, Mohali, Punjab 160062",
  },
  {
    state: "Rajasthan",
    branch: "Jaipur",
    address: "Shop No B-5, Raj Rajeshwari Apartment, Vaishali Nagar, Jaipur, Rajasthan 302021",
  },
  {
    state: "Tamil Nadu",
    branch: "Chennai",
    address: "No 53 & 55, Station Road, Radha Nagar, Chromepet, Chennai, Tamilnadu 600044",
  },
  {
    state: "Telangana",
    branch: "Hyderabad",
    address: "Dega Towers, Raj Bhavan Rd, Somajiguda, Hyderabad, Telangana 500082",
  },
  {
    state: "Uttar Pradesh",
    branch: "Uttar Pradesh",
    address: "Shambhu Tower, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
  },
  {
    state: "Uttarakhand",
    branch: "Uttarakhand",
    address: "MDDA Complex, Rajpur Rd, Dehradun, Uttarakhand 248001",
  },
  {
    state: "West Bengal",
    branch: "West Bengal",
    address: "VIP Enclave Phase 2 Block - C, Shop No 28, Ground Floor, Kolkata, West Bengal 700059",
  },
];

const STATE_NAME_ALIASES = {
  "andhara pradesh": "Andhra Pradesh",
  "andman nicobar": "Andaman And Nicobar Islands",
  "arunchal pradesh": "Arunachal Pradesh",
  dehli: "Delhi",
  gujrat: "Gujarat",
  karnatka: "Karnataka",
  maharashtra: "Maharashtra",
  panjab: "Punjab",
  rajasthan: "Rajasthan",
};

export const normalizeStateName = (state) => {
  if (!state) return "";

  const trimmedState = state.trim();
  const aliasKey = trimmedState.toLowerCase();

  return STATE_NAME_ALIASES[aliasKey] || trimmedState;
};

export const getBranchesForState = (state) => {
  const normalizedState = normalizeStateName(state);
  return branchMappings.filter(
    (item) => normalizeStateName(item.state) === normalizedState,
  );
};

export const branchMappingStates = Array.from(
  new Set(branchMappings.map((item) => item.state)),
).sort();

export const branchMappingBranches = Array.from(
  new Set(branchMappings.map((item) => item.branch)),
).sort();
