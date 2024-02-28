import React, { ChangeEvent, useState } from "react";

interface ImageInputProps {
  onImageChange: (image: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageChange(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageChange("");
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="imageInput" className="cursor-pointer ">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="overflow-hidden w-24 ring ring-primary ring-offset-base-100 ring-offset-2 h-24 rounded-full"
          />
        ) : (
          <img
            src="input.jpg"
            alt="Preview"
            className="overflow-hidden w-24 ring ring-primary ring-offset-base-100 ring-offset-2 h-24 rounded-full"
          />
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="imageInput"
      />
    </div>
  );
};

export default ImageInput;
