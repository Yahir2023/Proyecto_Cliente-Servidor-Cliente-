import Sidebar from "./Sidebar";

function DashboardA() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Bienvenido al Dashboard</h1>
      </div>
    </div>
  );
}
export default DashboardA;