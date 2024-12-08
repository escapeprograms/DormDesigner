const ControlsPopup = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            color: 'black',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
        }}>
            <h2 style={{color: 'black'}}>Editor Controls</h2>
            <ul>
                <li>Left Click Drag - rotate camera</li>
                <li>Right Click Drag - pan camera</li>
                <li>Click Dorm Item - select</li>
                <li>Click + Drag Dorm Item - move item</li>
                <li>Select Item, then left/right arrow keys - rotate item</li>
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

const NamePopup = ({onSave, onClose}) => {
    return (
        <div style = {{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            color: 'black',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
        }}> 
            <h2 style={{color: "black", margin: "2px"}}>Name before Saving</h2>
            <p style={{color: "black"}}>Give your untitled design a name before saving it.</p>
            <input
                type="text"
                placeholder='Untitled Design'
                style = {{
                    width: "100%",
                    boxSizing: 'border-box',
                    padding: "15px",
                    fontSize: "1rem",
                }}
            >
            </input>
            <div>
                <button
                    onClick = {onSave}
                    style={{
                        height: "40px",
                        marginTop: "15px",
                        padding: "12px",
                        backgroundColor: '#800000',
                        color: 'white',

                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Save
                </button>
                <button
                    onClick = {onClose}
                    style={{
                        height: "40px",
                        margin: "15px 8px 0px",
                        padding: "12px",
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        color: '#800000',

                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
            </div>
        
        </div>
    )
}

export {ControlsPopup, NamePopup}