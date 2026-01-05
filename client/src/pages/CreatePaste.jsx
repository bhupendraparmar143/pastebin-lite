import PasteForm from '../components/PasteForm';

const CreatePaste = () => {
  return (
    <div className="page create-paste">
      <div className="container">
        <h1>Pastebin Lite</h1>
        <PasteForm />
      </div>
    </div>
  );
};

export default CreatePaste;
