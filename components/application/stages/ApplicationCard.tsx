const applicationCardProps = {
  name: 'Jane Doe',
  status: 'Pending',
};

export default function ApplicationCard() {
  return (
    <div className="flex flex-col bg-amber-600">
      <p>Jane Doe</p>
      <p>Status: Pending</p>
      <p>Go to App</p>
    </div>
  );
}
