import { NavLink } from "react-router"
export default function Navbar() {
    return (
        <nav>
            <ul>
                <li><NavLink to={"/"}></NavLink>Home</li>
                <li><NavLink to={"/#"}></NavLink>Explore</li>
                <li><NavLink to={"/#"}></NavLink>Archive</li>
                <li><NavLink to={"/#"}></NavLink>Profile</li>
            </ul>
        </nav>
    )
}