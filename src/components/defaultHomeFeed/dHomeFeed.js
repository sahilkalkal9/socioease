import "./dHomeFeed.scss"
import wavee from "./wave.gif"


function DHomeFeed() {

    
   

    return (
        <div className="DHomeFeed">
            <br /><br /><br />
            <center>
                <img src={wavee} className="wavee" />
                
                
                <h2>Welcome to the SocioEase</h2>
                <h3>It is your feed section</h3>
                <p>Choose an option from above for feeds</p>
            </center>
        </div>
    )
}

export default DHomeFeed;