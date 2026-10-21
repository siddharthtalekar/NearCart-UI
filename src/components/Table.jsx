// src/components/Table.jsx
import styles from './Table.module.css';

export function Table({ headers = [], children, className = '' }) {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.table}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, onClick, className = '' }) {
  return (
    <tr
      className={`${styles.tr} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '', colSpan }) {
  return (
    <td className={`${styles.td} ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

export default Table;
