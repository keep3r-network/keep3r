import	React		from	'react';

import type {ReactElement} from 'react';

function IconKeep3r(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'32'}
			height={'32'}
			viewBox={'0 0 32 32'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<circle
				cx={'16'}
				cy={'16'}
				r={'16'}
				fill={'black'}/>
			<path d={'M8.44562 15.6534C8.3183 16.3019 8.40318 16.9727 8.65783 17.554H9.06101C9.01857 17.3528 9.03979 17.1292 9.12467 16.928C9.20955 16.7043 9.37931 16.5031 9.57029 16.3913C9.67639 16.3466 9.80371 16.3019 9.90981 16.2795C10.0159 16.2795 10.1432 16.2795 10.2493 16.2795C10.4403 16.2795 10.6313 16.2795 10.8223 16.2795C10.8223 16.8832 10.8223 17.5093 10.8223 18.1354C10.8223 18.5602 10.8223 19.0075 10.7374 19.4323C10.6525 19.8795 10.4828 20.282 10.2281 20.6174C10.0371 20.8857 9.78249 21.087 9.50663 21.2211H10.2069C10.8011 20.9975 11.3952 20.6845 11.9257 20.282C12.4562 19.9019 12.9231 19.4323 13.2202 18.8286C13.3687 18.5379 13.4536 18.2025 13.496 17.8894C13.5597 17.554 13.5597 17.2186 13.5597 16.8832V15.1391V12.6571C13.5597 11.8522 13.6233 11.0472 13.8992 10.287C14.1538 9.59379 14.5358 8.9677 15.0027 8.4087C15.1936 8.16273 15.4271 7.93913 15.6605 7.73789C15.7029 7.71553 15.7241 7.69317 15.7666 7.64845L15.809 7.31304C15.4695 7.55901 15.1088 7.73789 14.7056 7.80497C14.4085 7.87205 14.0902 7.89441 13.7931 7.84969C13.4111 7.78261 13.0292 7.64845 12.6684 7.51429C12.3077 7.40248 11.9257 7.26832 11.5438 7.24596C11.183 7.24596 10.8223 7.31304 10.504 7.46957C10.1857 7.62609 9.88859 7.84969 9.63395 8.09565C8.95491 8.76646 8.44562 9.61615 8 10.4658H8.48806C8.55172 10.1528 8.76393 9.86211 9.03979 9.70559C9.27321 9.54907 9.57029 9.50435 9.86737 9.52671C10.3342 9.57143 10.7798 9.75031 11.2467 9.86211C11.7135 9.97391 12.1804 10.0186 12.6472 9.88447C12.8594 9.83975 13.0504 9.75031 13.2414 9.66087L12.3714 10.4211C12.0955 10.6671 11.8196 10.9354 11.5862 11.2261C11.3528 11.5168 11.183 11.8522 11.0557 12.2323C10.8859 12.7242 10.8435 13.2609 10.8223 13.7975C10.4191 13.7975 9.9947 13.8422 9.63395 14.0211C9.31565 14.1553 9.03979 14.4012 8.82759 14.6696C8.6366 14.9602 8.50928 15.318 8.44562 15.6534ZM17.3581 10.1304C17.9523 10.5329 18.6525 10.7789 19.3528 10.8012L15.0239 16.1006L15.0875 12.277C15.1088 11.6286 15.1512 10.9801 15.3422 10.4211C15.5119 9.81739 15.8302 9.28075 16.2122 8.81118C16.6154 8.31925 17.0822 7.87205 17.5703 7.51429L17.4005 7.24596L17.2308 7C16.7003 7.40248 16.191 7.87205 15.7666 8.38634C15.3422 8.92298 14.9814 9.52671 14.7692 10.2199C14.557 10.8907 14.5146 11.6062 14.4934 12.277L14.3873 17.5764C14.3873 17.8894 14.3873 18.1578 14.3236 18.4261C14.2812 18.6944 14.2175 18.9627 14.0902 19.2087C13.878 19.7006 13.496 20.1031 13.0716 20.4832C12.6897 20.8186 12.2865 21.1093 11.8621 21.4C10.7798 21.8696 9.78249 22.6522 9.03979 23.6137C8.72149 24.0609 8.4244 24.5081 8.2122 25H8.84881C9.12467 24.5304 9.50663 24.1503 9.95225 23.8596C10.4403 23.5466 11.0133 23.3453 11.5862 23.2783C12.1592 23.1888 12.7533 23.2335 13.3263 23.3677C14.2599 23.5913 15.13 24.0609 15.8939 24.6646L18.8435 22.2273C19.0133 22.7416 19.2467 23.2559 19.5862 23.6584C19.9045 24.0832 20.3077 24.4186 20.7533 24.6422L24 21.9366V21.2435L22.5358 22.4286C22.2387 22.1602 21.9841 21.8472 21.7719 21.4894C21.4748 20.9975 21.305 20.4385 21.1565 19.8571C21.0292 19.2981 20.9231 18.7391 20.7745 18.1578C20.6048 17.5317 20.3501 16.9056 20.0106 16.3466C19.6711 15.8099 19.2255 15.318 18.7162 14.9155C18.2493 14.5801 17.7401 14.3118 17.2095 14.1329L19.9682 10.7789C20.3714 10.7342 20.7533 10.6 21.1353 10.3988C21.6658 10.1081 22.1326 9.61615 22.4085 9.03478C22.7056 8.45342 22.7905 7.78261 22.6843 7.13416H22.3873C22.2812 7.55901 21.9841 7.93913 21.6233 8.16273C21.1565 8.43106 20.6048 8.45342 20.0955 8.2969C19.6286 8.16273 19.183 7.87205 18.8647 7.46957L16.2546 10.7565L16.5517 11.0919L17.3581 10.1304ZM13.4536 20.9528C13.9204 20.5503 14.3448 20.0807 14.6207 19.477C14.7692 19.1863 14.8753 18.8733 14.9178 18.5379C14.9814 18.2248 14.9814 17.8894 14.9814 17.5988L15.0027 16.7043H15.0875L15.3634 16.3913C15.7878 16.4807 16.2122 16.682 16.5942 16.9503C17.1247 17.3528 17.5279 17.9342 17.8037 18.5602C18.1008 19.164 18.2706 19.8348 18.4191 20.5056C18.504 20.9528 18.5889 21.4 18.7162 21.8472L18.1008 22.3391C16.9337 21.3329 15.3634 20.8186 13.8568 20.9081C13.7082 20.9304 13.5809 20.9304 13.4536 20.9528Z'} fill={'white'}/>
		</svg>
	);
}

export default IconKeep3r;
