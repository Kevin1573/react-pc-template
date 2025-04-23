import styles from "./index.module.scss";
import SqlCodeHighlight from "./SqlCodeHighlight";
import SqlEditor from "./SqlEditor";

// type FieldType = {
//   username: string;
//   password: string;
// };

export default function TextParser() {
  // const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  // const useStateRef = useRef([] as string[])
  // const [sqlValues, setSqlValues] = useState<string[]>([]);
  // const [tableStatus, setTableStatus] = useState(false);

  return (
    <div className={styles.container}>
      <SqlEditor />

      <SqlCodeHighlight />
    </div>
  );
}
