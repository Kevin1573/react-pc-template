import JsonComparator from '../../components/JsonComparator';

const blueJson = `{"name":"John","age":30,"address":{"city":"New York","street":"123 Main St"},"id":"12345"}`;

const greenJson = `{"id":"12345","name":"Jane","age":25,"address":{"city":"Los Angeles","street":"456 Elm St"}}`;

export default function JsonView() {
    const blueJsonParsed = JSON.parse(blueJson);
    const greenJsonParsed = JSON.parse(greenJson);
    return (
        <div>
            <h1>JSON Comparator</h1>
            <JsonComparator blueJson={blueJsonParsed} greenJson={greenJsonParsed} />
        </div>
    );
}