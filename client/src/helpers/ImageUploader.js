import React from "react";
import ImageUploading from "react-images-uploading";

import searchImage from "../images/search-image.svg";


/**
 * props:
 * children -> the child
 * image -> default image
 * setImage -> function to set image in the father's state
 */
export default (props) => {
	// if default from props set it, otherwise empty list
	const [images, setImages] = React.useState(props.image ? [{ data_url: props.image }] : []);
	const maxNumber = 1;

	const onChange = (imageList, addUpdateIndex) => {
		// data for submit
		setImages(imageList);
		// pass image to father
		props.setImage(imageList.length > 0 ? imageList[0]["data_url"] : null);
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
				acceptType={['jpg', 'jpeg', 'png']}
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
