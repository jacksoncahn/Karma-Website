import './App.css'
export default function ActionEntry({action}) {
    const submitAction = (e) => {
        if (e.key === "Enter") {
            action(e);
        }
    };
    return (
        <form className="entry" onSubmit={action}>
            <input 
                type="text" 
                placeholder="Please enter an action"
                onKeyDown={submitAction}
            ></input>
        </form>
    )
}