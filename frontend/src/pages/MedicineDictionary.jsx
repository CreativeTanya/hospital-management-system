import { useState } from "react";
import {
  BookOpen,
  Search,
  Pill,
  Info,
} from "lucide-react";

const medicines = [
  {
    name: "Paracetamol",
    category: "Pain Relief",
    uses: "Commonly used to reduce fever and relieve mild to moderate pain.",
    note: "Use only according to the recommended dose.",
  },
  {
    name: "Ibuprofen",
    category: "Pain & Inflammation",
    uses: "Used to relieve pain, inflammation and fever.",
    note: "May not be suitable for everyone.",
  },
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    uses: "Used to treat certain bacterial infections.",
    note: "Use antibiotics only when prescribed.",
  },
  {
    name: "Azithromycin",
    category: "Antibiotic",
    uses: "Used to treat certain bacterial infections.",
    note: "Complete the prescribed course unless advised otherwise.",
  },
  {
    name: "Cetirizine",
    category: "Allergy",
    uses: "Commonly used to relieve allergy symptoms such as sneezing and itching.",
    note: "May cause drowsiness in some people.",
  },
  {
    name: "Loratadine",
    category: "Allergy",
    uses: "Used to relieve common allergy symptoms such as sneezing and runny nose.",
    note: "Follow the recommended instructions.",
  },
  {
    name: "Omeprazole",
    category: "Acid Reducer",
    uses: "Used to reduce stomach acid and manage certain acid-related conditions.",
    note: "Long-term use should be discussed with a professional.",
  },
  {
    name: "Pantoprazole",
    category: "Acid Reducer",
    uses: "Used to reduce stomach acid and certain acid-related conditions.",
    note: "Use according to medical advice.",
  },
  {
    name: "Metformin",
    category: "Diabetes",
    uses: "Commonly prescribed to help control blood glucose in type 2 diabetes.",
    note: "Should be taken only as prescribed.",
  },
  {
    name: "Glimepiride",
    category: "Diabetes",
    uses: "Used with diet and exercise to help control blood glucose.",
    note: "Can cause low blood sugar in some people.",
  },
  {
    name: "Amlodipine",
    category: "Blood Pressure",
    uses: "Commonly used to help control high blood pressure.",
    note: "Take regularly according to the prescription.",
  },
  {
    name: "Losartan",
    category: "Blood Pressure",
    uses: "Used to treat high blood pressure and certain cardiovascular conditions.",
    note: "Use only under medical supervision.",
  },
  {
    name: "Atorvastatin",
    category: "Cholesterol",
    uses: "Used to lower cholesterol and reduce certain cardiovascular risks.",
    note: "Regular medical monitoring may be required.",
  },
  {
    name: "Aspirin",
    category: "Antiplatelet",
    uses: "Used for pain in some situations and, when prescribed, to reduce blood clot formation.",
    note: "Do not start it for heart protection without medical advice.",
  },
  {
    name: "Diclofenac",
    category: "Pain & Inflammation",
    uses: "Used to reduce pain and inflammation in certain conditions.",
    note: "May not be suitable for everyone.",
  },
  {
    name: "Montelukast",
    category: "Respiratory / Allergy",
    uses: "Used in certain patients to help manage asthma or allergy symptoms.",
    note: "Take only as prescribed.",
  },
  {
    name: "Salbutamol",
    category: "Respiratory",
    uses: "Used to help relieve breathing difficulties caused by narrowed airways.",
    note: "Use according to the prescribed technique and dose.",
  },
  {
    name: "Ondansetron",
    category: "Anti-nausea",
    uses: "Used to help prevent or treat nausea and vomiting in certain situations.",
    note: "Use according to professional medical advice.",
  },
  {
    name: "Levothyroxine",
    category: "Thyroid",
    uses: "Used to replace thyroid hormone in people with an underactive thyroid.",
    note: "Dose should be monitored by a healthcare professional.",
  },
  {
    name: "Doxycycline",
    category: "Antibiotic",
    uses: "Used to treat certain bacterial infections.",
    note: "Use only when prescribed.",
  },
];

function MedicineDictionary() {
  const [search, setSearch] = useState("");

  const filteredMedicines = medicines.filter((medicine) =>
    `${medicine.name} ${medicine.category} ${medicine.uses}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="medicine-page">

      {/* Header */}

      <div className="medicine-page-header">

        <div>
          <h2>Medicine Dictionary</h2>

          <p>
            Search common medicines and understand what they
            are generally used for.
          </p>
        </div>

      </div>

      {/* Main Library */}

      <div className="medicine-library">

        {/* Toolbar */}

        <div className="medicine-toolbar">

          <div className="medicine-library-title">

            <div className="medicine-title-icon">
              <BookOpen size={19} />
            </div>

            <div>
              <h3>Medicine Library</h3>

              <span>
                General medicine information
              </span>
            </div>

          </div>

          <div className="medicine-count">
            {filteredMedicines.length} medicines
          </div>

        </div>

        {/* Search */}

        <div className="medicine-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search medicine, category or use..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Cards */}

        {filteredMedicines.length > 0 ? (

          <div className="medicine-grid">

            {filteredMedicines.map((medicine) => (

              <div
                className="medicine-card"
                key={medicine.name}
              >

                <div className="medicine-card-header">

                  <div className="medicine-icon">
                    <Pill size={20} />
                  </div>

                  <div className="medicine-name">

                    <h3>
                      {medicine.name}
                    </h3>

                    <span>
                      {medicine.category}
                    </span>

                  </div>

                </div>

                <div className="medicine-divider" />

                <div className="medicine-use">

                  <span>
                    COMMON USE
                  </span>

                  <p>
                    {medicine.uses}
                  </p>

                </div>

                <div className="medicine-note">

                  <Info size={14} />

                  <p>
                    {medicine.note}
                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="medicine-empty">

            <div className="medicine-empty-icon">
              <Search size={24} />
            </div>

            <h3>No medicine found</h3>

            <p>
              Try another medicine name or category.
            </p>

          </div>

        )}

        {/* Disclaimer */}

        <div className="medicine-disclaimer">

          <Info size={15} />

          <p>
            This information is provided for educational purposes.
            It does not replace advice from a qualified healthcare professional.
          </p>

        </div>

      </div>

    </div>
  );
}

export default MedicineDictionary;