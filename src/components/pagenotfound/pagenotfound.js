import "./pagenotfound.scss"
import er from "./error.png"

function Pagenotfound() {
    return (
        <div className="Pagenotfound"><br /><br />
            <center><div className="nf-contain">
                <img src={er} className="rxn-no-img" /><br /><br />
                <h3 className="rxn-no-text" >Sorry, no page found.</h3>
            </div></center>
        </div>
    )
}

export default Pagenotfound;