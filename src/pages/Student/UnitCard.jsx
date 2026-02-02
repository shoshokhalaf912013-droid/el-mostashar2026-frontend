import PropTypes from "prop-types";
import "./UnitCard.css";

export default function UnitCard({ unit, onClick }) {
  if (!unit) return null;

  const { order, title } = unit;

  return (
    <div className="unit-card" onClick={onClick}>
      {/* شارة UNIT */}
      <div className="unit-badge">
        <span className="unit-shine" />
        UNIT {order}
      </div>

      {/* لوحة العنوان */}
      <div className="unit-title-plate">
        <span className="unit-title-text">
          {title || "وحدة بدون عنوان"}
        </span>
      </div>
    </div>
  );
}

UnitCard.propTypes = {
  unit: PropTypes.shape({
    order: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};
