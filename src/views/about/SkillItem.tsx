import { FC } from "react";

export interface SkillItemProps {
  id: string;
  name: string;
  data: string[];
  skill_order: number;
}

const SkillItem: FC<SkillItemProps> = ({ name, data }) => {
  return (
    <div
      style={{
        backgroundColor: "#E0E0E0",
        border: "2px outset #DFDFDF",
        padding: "12px",
        borderRadius: "0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "16px" }}>⚙️</span>
        <h4 style={{ color: "#0000FF", margin: 0, fontSize: "14px", fontWeight: "bold" }}>
          {name}
        </h4>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {data.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: "#FF0000", fontSize: "8px" }}>■</span>
            <span style={{ color: "#000000", fontSize: "12px" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillItem;
