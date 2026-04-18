import SettingPanel from "../components/setting";
import SideFoot from "../components/sideFoot";

export default function SettingsPage() {
  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Settings" />
        <main className="dashboard-main flex w-full flex-col gap-6">
          <SettingPanel />
        </main>
      </div>
    </div>
  );
}
