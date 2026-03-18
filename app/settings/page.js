import SideFoot from "../components/sideFoot";
import SettingPanel from "../components/setting";

export default function SettingsPage() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Settings" />
        <main className="flex w-full flex-col gap-6">
          <SettingPanel />
        </main>
      </div>
    </div>
  );
}
