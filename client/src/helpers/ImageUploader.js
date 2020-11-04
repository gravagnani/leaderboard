import React from "react";
import ImageUploading from "react-images-uploading";

import searchImage from "../images/search-image.svg";

export default (props) => {
	const [images, setImages] = React.useState([]);
	const maxNumber = 1;

	const onChange = (imageList, addUpdateIndex) => {
		// data for submit
		setImages(imageList);
	};

	/**
	 * https://www.npmjs.com/package/react-images-uploading
	 */

	return (
		<div className="image-picker">
			<ImageUploading
				multiple
				value={images}
				onChange={onChange}
				maxNumber={maxNumber}
				dataURLKey="data_url"
			>
				{({
					imageList,
					onImageUpload,
					onImageRemoveAll,
					onImageUpdate,
					onImageRemove,
					isDragging,
					dragProps,
				}) => (
					<>
						{React.cloneElement(props.children, {
							imageSrc:
								images.length > 0 ? images[0]["data_url"] : searchImage,
							onClick:
								images.length === 0 ? onImageUpload : onImageRemoveAll,
							...dragProps,
						})}
					</>
				)}
			</ImageUploading>
		</div>
	);
};
