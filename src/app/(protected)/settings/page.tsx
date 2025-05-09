import { signOut } from "../../../../auth";

export default async function SettingsPage() {
  return (
    <div>
      <div
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Log out
      </div>
    </div>
  );
}
