import axios from 'axios';
import { Dispatch, FormEvent, useRef, useState } from 'react';
import { User } from '../types/user';
import LoadingSpinner from './loading';
import { useUser } from '../hooks/useUser';
import toast from 'react-hot-toast';

const apiUrl = 'http://localhost:3080';

interface ToggleProps {
  toggleValue: boolean;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  setToggleValue: Dispatch<React.SetStateAction<boolean>>;
  setQRCode: Dispatch<React.SetStateAction<string>>;
}

interface TwoFaModalProps {
  showModal: boolean;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  setToggleValue: Dispatch<React.SetStateAction<boolean>>;
  qrCode: string;
  setQRCode: Dispatch<React.SetStateAction<string>>;
}

function TwoFaModal({
  showModal,
  setShowModal,
  setToggleValue,
  qrCode,
  setQRCode,
}: TwoFaModalProps) {
  const verficationCodeRef = useRef<HTMLInputElement>(null);
  const [validCode, setValidCode] = useState<boolean>(true);

  function closeModal() {
    void axios
      .delete(`${apiUrl}/2fa/disable`, {
        withCredentials: true,
      })
      .then((res) => res);
    setQRCode('');
    setShowModal(false);
    setToggleValue(false);
  }

  function onSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = verficationCodeRef.current ? verficationCodeRef.current.value : '';
    
    void axios
      .post<string>(
        `${apiUrl}/2fa/validate`,
        { twoFactorAuthenticationCode: input },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data === 'invalidCode' || res.data === 'invalidSecret') {
          // Display toast for invalid code or secret
          toast.error('Invalid code or secret. Please try again.');
          setValidCode(false);
        } else {
          setValidCode(true);
          setShowModal(false);
        }
      })
      .catch((error) => {
        // Display toast for other errors
        toast.error('An error occurred. Please try again later.');
        console.error('Error validating code:', error);
      });
  }

  return (
    <>
      {showModal && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-[#222] bg-opacity-50">
          <div className="relative p-4 w-full max-w-xl h-full md:h-auto left-1/2 -translate-x-1/2">
            <div className="relative bg-white rounded-lg shadow text-black p-6">
              <h3 className="xl:text-xl lg:text-lg md:text-base sm:text-base text-base font-semibold text-gray-900 p-4 border-b">
                Two-Factor Authentication (2FA)
              </h3>
              <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b sm:my-2 md:my-2 mt-6 mb-4">
                Configuring Google Authenticator or Authy
              </h4>
              <div className="space-y-1 lg:text-sm md:text-sm sm:text-xs text-xs">
                <li>
                  Install Google Authenticator (IOS - Android) or Authy (IOS -
                  Android).
                </li>
                <li>In the authenticator app, select "+" icon.</li>
                <li>
                  Select "Scan a barcode (or QR code)" and use the phone's
                  camera to scan this barcode.
                </li>
              </div>
              <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b sm:my-2 md:my-2 mb-2 mt-4">
                Scan QR Code
              </h4>
              <div className="flex justify-center">
                {qrCode ? (
                  <img
                    className="block lg:w-64 md:w-40 sm:w-32 w-24 lg:h-64 md:h-40 sm:h-32 h-24 object-contain"
                    src={qrCode}
                  />
                ) : (
                  <LoadingSpinner />
                )}
              </div>
              <div>
                <h4 className="xl:text-base lg:text-base md:text-sm sm:text-xs text-xs text-purple-light font-medium border-b my-2">
                  Verify Code
                </h4>
                <h5 className=" lg:text-sm md:text-xs sm:text-xs text-xs py-2">
                  For changing the setting, please verify the authentication
                  code:
                </h5>
              </div>
              <form onSubmit={onSubmitHandler}>
                <input
                  className={`bg-gray-50 border md:text-xs sm:text-xs text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2 my-4 sm:my-2 md:my-2
                  ${
                    validCode
                      ? 'border-gray-300 text-gray-900'
                      : ' border-red-500 text-red-500'
                  }`}
                  type="text"
                  name="code"
                  placeholder="Authentication Code"
                  ref={verficationCodeRef}
                  onInput={() => setValidCode(true)}
                />
                <div className=" items-center py-2 space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-purple-light hover:bg-purple-medium font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Verify & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 *
 * This function generates the 2FA Secret and displays the toggle button if 2fa is set or not
 *
 */

function Generate2fa({
  toggleValue,
  setShowModal,
  setToggleValue,
  setQRCode,
}: ToggleProps) {
  /* Generate 2FA Secret */
  const {mutate} = useUser();
  function on2faActivation() {
    void axios
      .post<string>(
        `${apiUrl}/2fa/generate`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((response) => setQRCode(response.data));
    setToggleValue(true);
    setShowModal(true);
    mutate;
  }

  return (
    <div>
      <div
        onClick={on2faActivation}
        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
        after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
      >
        {toggleValue ? (
          <span className="ml-1 font-bold text-[9px]">ON</span>
        ) : (
          <span className="ml-6 font-bold text-[9px] text-black">OFF</span>
        )}
      </div>
    </div>
  );
}

/**
 *
 * This function displays the toggle button if 2fa is set or not
 *
 */

function Disable2fa({
  toggleValue,
  setShowModal,
  setToggleValue,
  setQRCode,
}: ToggleProps) {
  function on2faDelete() {
    void axios
      .delete(`${apiUrl}/2fa/disable`, {
        withCredentials: true,
      })
      .then((res) => res);
    setQRCode('');
    setToggleValue(false);
    setShowModal(false);
  }

  return (
    <>
      <div
        onClick={on2faDelete}
        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
      >
        {toggleValue ? (
          <span className="ml-1 font-bold text-[9px]">ON</span>
        ) : (
          <span className="ml-6 font-bold text-[9px] text-black">OFF</span>
        )}
      </div>
    </>
  );
}


function Toggle({
  toggleValue,
  setShowModal,
  setToggleValue,
  setQRCode,
}: ToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-20">
      <label className="relative cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={toggleValue}
          readOnly
        />
        {toggleValue ? (
          <Disable2fa
            toggleValue={toggleValue}
            setShowModal={setShowModal}
            setToggleValue={setToggleValue}
            setQRCode={setQRCode}
          />
        ) : (
          <Generate2fa
            toggleValue={toggleValue}
            setShowModal={setShowModal}
            setToggleValue={setToggleValue}
            setQRCode={setQRCode}
          />
        )}
      </label>
    </div>
  );
}

function TwoFactorAuthentication() {
  const { user, isLoading, error } = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>('');
  const [toggleValue, setToggleValue] = useState<boolean>(
    user.twoFactorEnabled,
  );
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error) {
    return <p>Error 2fa </p>;
  }
  return (
    <div className="flex flex-row gap-4">
      <p>Two factor identification</p>
      <Toggle
        toggleValue={toggleValue}
        setShowModal={setShowModal}
        setToggleValue={setToggleValue}
        setQRCode={setQRCode}
      />
      {showModal && (
        <TwoFaModal
          showModal={showModal}
          setShowModal={setShowModal}
          setToggleValue={setToggleValue}
          qrCode={qrCode}
          setQRCode={setQRCode}
        />
      )}
    </div>
  );
}

export default TwoFactorAuthentication;