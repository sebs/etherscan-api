import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<iron-iconset-svg name="svg-sample-icons" size="100">
  <svg>
    <defs>
			<g id="cap">
				<svg style="width:24px;height:24px" viewBox="0 0 24 24">
					<path fill="#000000" d="M15,14V8H17.17L12,2.83L6.83,8H9V14H15M12,0L22,10H17V16H7V10H2L12,0M7,18H17V24H7V18M15,20H9V22H15V20Z" />
				</svg>
			</g>
			<g id="volume">
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path fill="#000000" d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z" />
</svg>
			</g>
    </defs>
  </svg>
</iron-iconset-svg><iron-iconset-svg name="inline" size="24">
  <svg>
    <defs>
      <g id="shape">
        <rect x="12" y="0" width="12" height="24"></rect>
        <circle cx="12" cy="12" r="12"></circle>
      </g>
    </defs>
  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);