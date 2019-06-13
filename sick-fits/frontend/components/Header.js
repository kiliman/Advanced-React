import Nav from './Nav'

const Header = () => (
  <div>
    <div className="bar">
      <a href="">Sick Fits</a>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
      <div>Cart</div>
    </div>
  </div>
)

export default Header
