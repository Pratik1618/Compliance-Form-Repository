import mmfslRawData from "./mmfsl.json";

const COMMON_21_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Orissa",
  "Rajasthan",
  "Tamil Nadu",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const buildChecklistFromCommonActs = (items) =>
  items.map((item) => ({
    label: item.form ? `${item.description} (${item.form})` : item.description,
    category: item.category,
    path: item.path || "",
    frequency: "",
    notes: "",
    act: item.act,
    form: item.form,
    stateCount: item.stateCount,
    states: item.states,
    notApplicableStates: item.notApplicableStates || [],
  }));

const splitStateList = (value) =>
  (value || "")
    .split(",")
    .map((state) => state.trim())
    .filter(Boolean);

const normalizeMmfslText = (value) =>
  (value || "")
    .replace(/Â/g, "")
    .replace(/\s+/g, " ")
    .trim();

const inferMmfslPath = ({ Act, Description, Forms }) => {
  const act = normalizeMmfslText(Act).toLowerCase();
  const description = normalizeMmfslText(Description).toLowerCase();
  const form = normalizeMmfslText(Forms).toLowerCase();

  if (act.includes("bonus") && form.includes("form c")) {
    return "/Central/Bouns/FORM C Bonus Paid To Employees.xlsx";
  }
  if (act.includes("bonus") && form.includes("form d")) {
    return "/Central/Bouns/Form D.xlsx";
  }
  if (act.includes("employee compensation")) {
    return "/Central/Compensation/Returns As To Compensation.xlsx";
  }
  if (act.includes("provident fund") && form.includes("form 11")) {
    return "/Central/PF/Composite Declaration FORM 11.docx";
  }
  if (act.includes("state insurance") && description.includes("accident register")) {
    return "/Central/ESIC/FORM 11.pdf";
  }
  if (act.includes("equal remuneration")) {
    return "/Central/Wages/Form D (1).xlsx";
  }
  if (act.includes("labour welfare") && description.includes("payment of contribution")) {
    return "/Gujrat/LWF/FORM A-1.docx";
  }
  if (act.includes("labour welfare") && description.includes("register of unpaid accumulations")) {
    return "/West Bengal/Minimum Wages/FORM H Register Of Fines And Unpaid Accumulation LWF.docx";
  }
  if (act.includes("maternity") && description.includes("maternity register")) {
    return "/MAHARASHTRA/FORM 10 Maternity Benefit Register.docx";
  }
  if (act.includes("maternity") && description.includes("annual returns")) {
    return "/Central/Maternity/FORM L.xlsx";
  }
  if (act.includes("minimum wages") && form.includes("form iii")) {
    return "/West Bengal/Minimum Wages/FORM III Annual Returns.docx";
  }
  if (act.includes("payment of gratuity") && form.includes("form l")) {
    return "/Central/Gratuity/FORM L Payment Of Gratuity.xlsx";
  }
  if (act.includes("payment of gratuity") && form.includes("form f")) {
    return "/Central/Gratuity/FORM F Nomination Form And Updation Of Nomination Form.xlsx";
  }
  if (act.includes("payment of wages") && description.includes("annual returns")) {
    return "/West Bengal/POW/FORM IV Annual Return.docx";
  }
  if (act.includes("payment of wages") && description.includes("form 1 nomination")) {
    return "/Central/PF/FORM 2 Nomination And Declaration Form For Unexempted-Exempted Establishments.pdf";
  }
  if (act.includes("professional tax") && description.includes("annual return")) {
    return "/KARNATKA/FORM 9-A PT.docx";
  }
  if (act.includes("contract labour") && description.includes("half yearly returns")) {
    return "/Central/CLRA Central/Form XXIV Half year return.xlsx";
  }
  if (act.includes("contract labour") && description.includes("muster roll")) {
    return "/MAHARASHTRA/CLRA/FORM II Muster Roll Cum Wage Register.xlsx";
  }
  if (act.includes("contract labour") && description.includes("register of advances")) {
    return "/Central/CLRA Central/Form XVII Register of Wages.xlsx";
  }
  if (act.includes("contract labour") && description.includes("register of workmen")) {
    return "/MAHARASHTRA/CLRA/FORM XIII Register Of Workmen Employed By Contractor.docx";
  }
  if (act.includes("contract labour") && description.includes("service certificate")) {
    return "/Gujrat/Factory/FORM No. 15.xlsx";
  }
  if (act.includes("contract labour") && description.includes("wage slip")) {
    return "/Central/CLRA Central/Form XIX Wage Slip.xlsx";
  }
  if (act.includes("contract labour") && description.includes("wage register")) {
    return "/Central/CLRA Central/Form XVII Register of Wages.xlsx";
  }

  return "";
};

const categorizeMmfslRecord = ({ Act, Description }) => {
  const act = normalizeMmfslText(Act).toLowerCase();
  const description = normalizeMmfslText(Description).toLowerCase();

  if (act.includes("bonus")) return "Bonus";
  if (act.includes("maternity")) return "Maternity";
  if (act.includes("gratuity")) return "Gratuity";
  if (
    act.includes("provident fund") ||
    act.includes("state insurance") ||
    act.includes("professional tax") ||
    act.includes("labour welfare") ||
    act.includes("minimum wages") ||
    act.includes("national & festival holidays") ||
    act.includes("payment of wages")
  ) {
    return "Statutory Payments";
  }
  if (act.includes("contract labour")) {
    if (
      description.toLowerCase().includes("appointment") ||
      description.toLowerCase().includes("service certificate")
    ) {
      return "Employee & HR Records";
    }
    if (
      description.toLowerCase().includes("license") ||
      description.toLowerCase().includes("commencement/completion")
    ) {
      return "Company & License Documents";
    }
    if (description.toLowerCase().includes("half yearly")) {
      return "Returns";
    }
    return "Register and Records";
  }
  if (act.includes("private security")) return "Company & License Documents";
  if (act.includes("sexual harassment")) return "Policy";
  if (act.includes("employee compensation")) return "Insurance";
  if (act.includes("child labour")) return "Statutory Proof";
  if (act.includes("equal remuneration")) return "Register and Records";

  return "General Compliance";
};

const mahindraMahindraFinanceFromJson = mmfslRawData.map((item) => ({
  act: normalizeMmfslText(item.Act),
  description: normalizeMmfslText(item.Description),
  form: normalizeMmfslText(item.Forms),
  category: normalizeMmfslText(item.Act),
  stateCount: Number.parseInt(item.State_Count, 10) || 0,
  states: splitStateList(item.States),
  notApplicableStates: splitStateList(item.Not_Applicable_States),
  path: inferMmfslPath(item),
}));

const mahindraMahindraFinanceCommonActs = [
  {
    act: "Bonus Act",
    description: "Bonus Register",
    form: "Form C",
    category: "Bonus",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Bouns/FORM C Bonus Paid To Employees.xlsx",
  },
  {
    act: "Bonus Act",
    description: "Form D - Annual Return",
    form: "Form D",
    category: "Bonus",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Bouns/Form D.xlsx",
  },
  {
    act: "Child Labour Prohibition And Regulation Act 1986",
    description: "Prohibition Of Employment Of Child Labour",
    form: "Declaration",
    category: "Statutory Proof",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employee Compensation Act, 2010",
    description: "EC/WC Policy",
    form: "Insurance",
    category: "Insurance",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Compensation/Returns As To Compensation.xlsx",
  },
  {
    act: "Employees Provident Fund Act & Scheme",
    description: "Arrears of PF - if applicable for audit period",
    form: "PF Challan",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employees Provident Fund Act & Scheme",
    description: "PF Declaration",
    form: "Form 11",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/PF/Composite Declaration FORM 11.docx",
  },
  {
    act: "Employees Provident Fund Act & Scheme",
    description: "PF ECR Statement with employee highlighted",
    form: "Electronic",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employees Provident Fund Act & Scheme",
    description: "Remittance of the contributions to be made before 15th of every month",
    form: "PF Challan",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employees State Insurance Act & Scheme",
    description: "ESI Accident Register",
    form: "Form 11",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/ESIC/FORM 11.pdf",
  },
  {
    act: "Employees State Insurance Act & Scheme",
    description: "ESI Cards (TIC or E-Pehchan)",
    form: "ESI Card",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employees State Insurance Act & Scheme",
    description: "ESI Registration Certificate & 17 digit code allotment letter copy",
    form: "ESI Statewise",
    category: "Statutory Proof",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Employees State Insurance Act & Scheme",
    description: "Monthly remittance online challan",
    form: "Challan",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Equal Remuneration Act",
    description: "Equal Remuneration Form",
    form: "Form D",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Wages/Form D (1).xlsx",
  },
  {
    act: "Labour Welfare Fund Act",
    description: "Payment of contribution along with statement of contributions",
    form: "Statewise",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Gujrat/LWF/FORM A-1.docx",
  },
  {
    act: "Labour Welfare Fund Act",
    description: "Register of unpaid accumulations, fines and deductions",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/West Bengal/Minimum Wages/FORM H Register Of Fines And Unpaid Accumulation LWF.docx",
  },
  {
    act: "Maternity Benefit Act",
    description: "Maternity Register/Muster Roll",
    form: "Form 10 / Form 11",
    category: "Maternity",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/MAHARASHTRA/FORM 10 Maternity Benefit Register.docx",
  },
  {
    act: "Maternity Benefit Act",
    description: "Maternity annual return",
    form: "Form L, M, N",
    category: "Maternity",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Maternity/FORM L.xlsx",
  },
  {
    act: "Minimum Wages Act",
    description: "Annual Returns Under Minimum Wages Act 1948",
    form: "Form III",
    category: "Returns",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/West Bengal/Minimum Wages/FORM III Annual Returns.docx",
  },
  {
    act: "National & Festival Holidays Act",
    description: "Wages To Be Paid towards National & Festival Holidays",
    form: "Statewise",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Payment of Gratuity Act",
    description: "Gratuity settlement details for eligible employees",
    form: "Form I",
    category: "Gratuity",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Gratuity/FORM I Payment Of Gratuity.xlsx",
  },
  {
    act: "Payment of Gratuity Act",
    description: "Nomination Form",
    form: "Form F",
    category: "Gratuity",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/Gratuity/FORM F Nomination Form And Updation Of Nomination Form.xlsx",
  },
  {
    act: "Payment of Wages Act",
    description: "Annual Returns Under Payment Of Wages Act 1936",
    form: "Annual Return",
    category: "Returns",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/West Bengal/POW/FORM IV Annual Return.docx",
  },
  {
    act: "Payment of Wages Act",
    description: "Disbursement of wages before 7th/10th with proof",
    form: "Declaration",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Payment of Wages Act",
    description: "Form I Nominations",
    form: "Form I",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/PF/FORM 2 Nomination And Declaration Form For Unexempted-Exempted Establishments.pdf",
  },
  {
    act: "Payment of Wages Act",
    description: "Proof Of Payment - Full and Final Settlement",
    form: "Proof Of Payment",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Private Security Agency Regulation Act",
    description: "Registration of Security Agency (PSARA)",
    form: "Declaration",
    category: "Company & License Documents",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "Professional Tax Act",
    description: "PT Annual Return",
    form: "Statewise",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/KARNATKA/FORM 9-A PT.docx",
  },
  {
    act: "Professional Tax Act",
    description: "PT Challan",
    form: "Statewise",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Appointment Letters",
    form: "Statewise",
    category: "Employee & HR Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Contract Labour License, if applicable",
    form: "Form VI",
    category: "Company & License Documents",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Half Yearly returns by contractor",
    form: "Statewise",
    category: "Returns",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/CLRA Central/Form XXIV Half year return.xlsx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Muster Roll / Muster Roll Cum Wage Register",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/MAHARASHTRA/CLRA/FORM II Muster Roll Cum Wage Register.xlsx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Rate of Wages under Contract Labour Act",
    form: "Statewise",
    category: "Statutory Payments",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Register of Advances, Deductions, Damage or Loss, Fines, Overtime, Wages",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/CLRA Central/Form XVII Register of Wages.xlsx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Register of workmen employed by contractor",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/MAHARASHTRA/CLRA/FORM XIII Register Of Workmen Employed By Contractor.docx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Sent a Notice of commencement/completion of contract work",
    form: "Statewise",
    category: "Company & License Documents",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Service Certificate",
    form: "Statewise",
    category: "Employee & HR Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Gujrat/Factory/FORM No. 15.xlsx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Wage Slip",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/CLRA Central/Form XIX Wage Slip.xlsx",
  },
  {
    act: "The Contract Labour (Regulation & Abolition) Act, 1970",
    description: "Wage register",
    form: "Statewise",
    category: "Register and Records",
    stateCount: 21,
    states: COMMON_21_STATES,
    path: "/Central/CLRA Central/Form XVII Register of Wages.xlsx",
  },
];

export const clientComplianceFormMapping = {
  "Pirmal Finance Limited": [
    {
      label: "Number of Workmen as on",
      path: "/West Bengal/BOCW/FORM XV Register of Persons employed.xlsx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Workmen",
      path: "/MAHARASHTRA/Allowances/FORM I Register Of Workmen.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Attendance Register",
      path: "/MAHARASHTRA/CLRA/FORM II Attendance Card Cum Wages Slip.xlsx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Wages",
      path: "/MAHARASHTRA/FORM B Register Of Wages LWF.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Pay Slip",
      path: "/Central/CLRA Central/Form XIX Wage Slip.xlsx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "PF ECR",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Combined Challan",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Payment Confirmation Challan",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC ECR",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC Challan",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "Professional Tax Challan",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "Professional Tax Return",
      path: "",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "LWF Return Cum Challan Copy June / Dec",
      path: "/West Bengal/FORM D Statement Regarding Contributions LWF.docx",
      category: "Statutory Proof",
      frequency: "",
      notes: "",
    },
    {
      label: "Workmen Compensation Policy",
      path: "/Central/Compensation/Returns As To Compensation.xlsx",
      category: "Policy",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Loss & Damage",
      path: "/West Bengal/CLRA/FORM XX Register Of Deductions For Damage Or Loss.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Fines",
      path: "/West Bengal/CLRA/FORM XXI Register Of Fines.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Advance",
      path: "/West Bengal/CLRA/FORM XXII Register Of Advances.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Overtime",
      path: "/West Bengal/CLRA/FORM XXIII Register Of Overtime.docx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of ESIC Accident",
      path: "/Central/ESIC/FORM 11.pdf",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Form C (Bonus)",
      path: "/Central/Bouns/FORM C Bonus Paid To Employees.xlsx",
      category: "Bonus",
      frequency: "",
      notes: "",
    },
    {
      label: "Form D (Bonus Return)",
      path: "/Central/Bouns/Form D.xlsx",
      category: "Bonus",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Leave Form O",
      path: "/MAHARASHTRA/S&E/FORM O Leave Book.xlsx",
      category: "Registers",
      frequency: "",
      notes: "",
    },
    {
      label: "Maternity Benefit Register (Form10)",
      path: "/MAHARASHTRA/FORM 10 Maternity Benefit Register.docx",
      category: "Maternity",
      frequency: "",
      notes: "",
    },
  ],
  "Paushak Limited": [
    {
      label: "The Name, Contact No. & Address of authorized representative of contractor.",
      path: "",
      category: "Onboarding",
      frequency: "One time, Before commencement of work",
      notes: "",
    },
    {
      label: "Copy of work order / agreement placed by COMPANY",
      path: "",
      category: "Onboarding",
      frequency: "Before commencement of work, renewal basis",
      notes: "",
    },
    {
      label: "Copy of Labour License",
      path: "",
      category: "Onboarding",
      frequency: "One time, in case of workers are more than 49, renewal basis",
      notes: "",
    },
    {
      label: "Separate Workmen Compensation Policy (mentioning Paushak Limited as a work location)",
      path: "",
      category: "Policy",
      frequency: "Before commencement of work, renewal basis",
      notes: "",
    },
    {
      label: "Copy of PF code allotment letter.",
      path: "",
      category: "Statutory Proof",
      frequency: "One time, Before commencement of work",
      notes: "",
    },
    {
      label: "Copy of PF challan, ECR and Payment Proof",
      path: "",
      category: "Statutory Proof",
      frequency: "Before 15 of every month",
      notes: "",
    },
    {
      label: "Payment Register & Bank Statement to be certified",
      path: "",
      category: "Payroll",
      frequency: "Before 07 of every month",
      notes: "",
    },
    {
      label: "Professional tax Payment",
      path: "",
      category: "Statutory Proof",
      frequency: "Before 15 of every month",
      notes: "",
    },
    {
      label: "Form No. 14 employment Card.",
      path: "/West Bengal/CLRA/FORM XIV Employment Card.docx",
      category: "Registers",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form no. 15 service certificate & F&F settlement",
      path: "/Gujrat/Factory/FORM No. 15.xlsx",
      category: "Exit Records",
      frequency: "In case of workers left",
      notes: "",
    },
    {
      label: "Form No. 18 Leave register / Leave Card",
      path: "/Gujrat/S&E/FORM M Register Of Leave.docx",
      category: "Registers",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form no. 19 Wage slip.",
      path: "/Central/CLRA Central/Form XIX Wage Slip.xlsx",
      category: "Payroll",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. A Format of Employee Register under Ease of Compliance Rules, 2017",
      path: "/Gujrat/CLRA/FORM A Workman reg.xlsx",
      category: "Ease of Compliance",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. B Format for Wage Register under Ease of Compliance Rules, 2017",
      path: "/Gujrat/Wages Act/FORM B Wages.xlsx",
      category: "Ease of Compliance",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. C Format of Register of Loan/Recoveries under Ease of Compliance Rules, 2017",
      path: "/Gujrat/Wages Act/FORM C Advance.xlsx",
      category: "Ease of Compliance",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. D Format of Attendance Register under Ease of Compliance Rules, 2017",
      path: "/Gujrat/Minimum wages/FORM D Muster.xlsx",
      category: "Ease of Compliance",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. 23 Register of Overtime.",
      path: "/Central/CLRA Central/Form XXIII Register of Overtime.xlsx",
      category: "Registers",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "Form No. 24 for 30the June & 31 Dec. Half Yearly (for every contractor)",
      path: "/Central/CLRA Central/Form XXIV Half year return.xlsx",
      category: "Returns",
      frequency: "Every six month, In July & In Jan",
      notes: "",
    },
    {
      label: "I card Register & I Card",
      path: "",
      category: "Identity",
      frequency: "Every Month",
      notes: "",
    },
    {
      label: "BONUS Registers - A, B, C, & D",
      path: "/Central/Bouns/FORM C Bonus Paid To Employees.xlsx",
      category: "Bonus",
      frequency: "After Bonus Disbursement",
      notes: "Repository contains separate bonus files, including Form D.",
    },
    {
      label: "Attendance related instruction and Document",
      path: "",
      category: "Instructions",
      frequency: "Every Month",
      notes:
        "Maximum 8 hours working in a day; Weekly Off after every 6 continuous working day; Compulsory OFF on Holiday on National and Festival holidays; Avoid Overtime Except unavoidable Circumstances",
    },
    {
      label: "New employment",
      path: "/Central/PF/FORM 2 Nomination And Declaration Form For Unexempted-Exempted Establishments.pdf",
      category: "Onboarding",
      frequency: "One time, at the time of new joining",
      notes:
        "Signed copy of Appointment letters; Nomination form; PF & Gratuity nomination form; ID proof (Aadhar mandatory) & ID Card; Workers Salary Bank account mandatory; Bio data form; Police Verification",
    },
    {
      label: "All other registers /records / forms /returns as per applicable acts and rules time being in force",
      path: "",
      category: "General Compliance",
      frequency: "Monthly / Quarterly / Half yearly / Yearly",
      notes: "",
    },
  ],
  "Aditya Birla Fashion and Retail Limited": [
    {
      label: "Valid PSARA Licence (Security vendors)",
      path: "",
      category: "Company & License Documents",
      frequency: "",
      notes: "",
    },
    {
      label: "GST Registration Certificate",
      path: "",
      category: "Company & License Documents",
      frequency: "",
      notes: "",
    },
    {
      label: "Professional Tax (PT) Registration",
      path: "",
      category: "Company & License Documents",
      frequency: "",
      notes: "",
    },
    {
      label: "Employee master list for staff deployed at our site - Month Wise",
      path: "/Gujrat/CLRA/FORM A Workman reg.xlsx",
      category: "Employee & HR Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Background verification reports / Police verification (mandatory for Security)",
      path: "",
      category: "Employee & HR Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Appointment letters / ID cards",
      path: "",
      category: "Employee & HR Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Salary register for the audit period",
      path: "/Gujrat/Wages Act/FORM B Wages.xlsx",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Wage slips",
      path: "/Central/CLRA Central/Form XIX Wage Slip.xlsx",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Bank transfer proofs (NEFT/RTGS)",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF: UAN list",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF: ECR",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF: Challans",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC: TIC/Pehchan cards",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC: Challans",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PT Challans",
      path: "",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "LWF Challans",
      path: "/Gujrat/LWF/FORM A-1.docx",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Bonus Paid Details",
      path: "/Central/Bouns/FORM C Bonus Paid To Employees.xlsx",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Gratuity Paid Details",
      path: "/Central/Gratuity/FORM L Payment Of Gratuity.xlsx",
      category: "Wages & Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Safety training records",
      path: "",
      category: "Safety & Operational Compliance",
      frequency: "",
      notes: "",
    },
    {
      label: "Security training certificates (security vendor)",
      path: "",
      category: "Safety & Operational Compliance",
      frequency: "",
      notes: "",
    },
    {
      label: "Valid Workmen Compensation (WC) policy",
      path: "/Central/Compensation/Returns As To Compensation.xlsx",
      category: "Insurance",
      frequency: "",
      notes: "",
    },
    {
      label: "Employee Personal Accident (PA) policy",
      path: "",
      category: "Insurance",
      frequency: "",
      notes: "",
    },
  ],
  Bluestar: [
    {
      label: "Employees working on site are lesser or equal to the number mentioned in License",
      path: "",
      category: "One time - Registration / License / timely renewals",
      frequency: "",
      notes: "",
    },
    {
      label: "Salary Payment - Date on or before 7th/10th of every month",
      path: "/Gujrat/Wages Act/FORM B Wages.xlsx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "The Copy of Bank Transfer / Copy of Cheque brought for verification & tallying with Net Pay of Salary Register",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Minimum Wages",
      path: "/Central/Wages/FORM IX-A Abstract Of The Minimum Wages Act, 1948.docx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Challan copy",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF ECR Statement",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Payment Confirmation",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Payment within due date i.e. 15th of every month",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PF Declaration Form 11",
      path: "/Central/PF/Composite Declaration FORM 11.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC Challan Copy",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC Contribution History",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC Payment within due date i.e. 15th of every month",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "ESIC TIC Card",
      path: "/Central/ESIC/FORM 11.pdf",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "PT Paid Challan Copy",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PT Return Copy",
      path: "/KARNATKA/FORM 9-A PT.docx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "PT Payment within due date i.e. 30th of every month",
      path: "",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "LWF Payment Challan",
      path: "/Gujrat/LWF/FORM A-1.docx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "LWF paid within 15 days of completion of eligible month",
      path: "/Gujrat/LWF/FORM A-1.docx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Overtime Hours Limit not to exceed as mentioned in the Act",
      path: "/Central/CLRA Central/Form XXIII Register of Overtime.xlsx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Overtime paid double the rate of gross wages",
      path: "/Central/CLRA Central/Form XXIII Register of Overtime.xlsx",
      category: "Statutory Payments",
      frequency: "",
      notes: "",
    },
    {
      label: "Muster Roll cum Attendance Register",
      path: "/MAHARASHTRA/CLRA/FORM II Muster Roll Cum Wage Register.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Wages",
      path: "/Central/CLRA Central/Form XVII Register of Wages.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Workmen",
      path: "/MAHARASHTRA/CLRA/FORM XIII Register Of Workmen Employed By Contractor.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Deductions for Damage or Loss",
      path: "/West Bengal/CLRA/FORM XX Register Of Deductions For Damage Or Loss.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Loans and Recoveries",
      path: "/Central/CLRA Central/Form XXII Register of Advances.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Fines",
      path: "/Central/CLRA Central/Form XXI Register of Fines.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Advances",
      path: "/Central/CLRA Central/Form XXII Register of Advances.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Register of Overtime",
      path: "/Central/CLRA Central/Form XXIII Register of Overtime.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Pay Slips",
      path: "/Central/CLRA Central/Form XIX Wage Slip.xlsx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "In-Out Register",
      path: "",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Leave Book",
      path: "/KARNATKA/Factory/FORM No. 15 Leave Book.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Employment card",
      path: "/Uttarakhand/CLRA/FORM XIV Employment card.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
    {
      label: "Accident Register",
      path: "/KARNATKA/Factory/FORM No. 23 Register Of Accidents And Dangerous Occurrences.docx",
      category: "Register and Records",
      frequency: "",
      notes: "",
    },
  ],
  "Mahindra and Mahindra Finance Limited":
    buildChecklistFromCommonActs(mahindraMahindraFinanceFromJson),
};

export const clientComplianceOptions = Object.keys(clientComplianceFormMapping);
