import { useState } from 'react';
import Modal from './components/Modal/Modal';
import ReactHookForm from './components/forms/ReactHookForm';
import UncontrolledForm from './components/forms/UncontrolledForm';
import SubmissionList from './components/Submission/SubmissionList';
import './App.css';

type FormType = 'uncontrolled' | 'rhf' | null;

function App() {
  const [modalType, setModalType] = useState<FormType>(null);

  const openModal = (type: FormType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="page">
      <h1>Form Submissions</h1>
      <div className="buttons">
        <button type="button" onClick={() => openModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button type="button" onClick={() => openModal('rhf')}>
          Open React Hook Form
        </button>
      </div>

      <SubmissionList />

      <Modal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={modalType === 'uncontrolled' ? 'Uncontrolled Form' : 'React Hook Form'}
      >
        {modalType === 'uncontrolled' ? (
          <UncontrolledForm onClose={closeModal} />
        ) : modalType === 'rhf' ? (
          <ReactHookForm onClose={closeModal} />
        ) : null}
      </Modal>
    </div>
  );
}

export default App;
