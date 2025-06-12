import Form from '@/components/Form';

export default function Reserve() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-orange-400 m-4">Reservation</h1>
      <div className="w-150 h-100 bg-orange-200 rounded-md shadow-lg text-black">
        <Form />
      </div>
    </div>
  );
}
