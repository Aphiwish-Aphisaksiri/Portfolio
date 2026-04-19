import dynamic from "next/dynamic";

const ClayModel = dynamic(() => import("./ClayModelCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  ),
});

export default ClayModel;
