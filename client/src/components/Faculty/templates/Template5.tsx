// src/components/PVCIdCard.tsx (Corrected Template5 for text overflow)

import React, { useState } from 'react';
import './style.css'
import html2canvas from 'html2canvas'; // html2canvas is not used directly in this component, but if you re-introduce it, ensure it's handled.
import Barcode from 'react-barcode';
import { IdCard } from '@/types/IdCard';
import logo from '../../../assects/iimtLogo.png';
import sign from '../../../assects/sign.png';
import { extractDriveFileId } from '@/utils/ExtractUrlParams';

interface PVCIdCardProps {
  card: IdCard;
}

// src/components/PVCIdCard.tsx
interface PVCIdCardProps {
  card: IdCard;
}

const Template5: React.FC<PVCIdCardProps> = ({ card }) => {
  const barcodeValue = card.barcodeDataString || card.admissionId?.toString() || 'ID';
  const [isact, setH] = useState(false);
  return (
    <div className={`pvc-wrapper ${isact && "print-layout"}`}>
      {/* FRONT SIDE */}
      {/* <span onClick={()=>setH(prev=>!prev)}>{isact?"print":"web"}</span> */}
      <div className="pvc-card front">
        <img
          src={card.universityLogo || logo}
          alt="University Logo"
          className="logo-img"
           loading="lazy"
        />

        <ul className="card-info">
          <li className="avatar-box">
            <img
              src={extractDriveFileId(card.photo || '') || 'https://www.shutterstock.com/image-photo/passport-photo-portrait-young-man-260nw-2437772333.jpg'}
              alt="Student"
              className="avatar-img"
            />
          </li>

          <li className="name-barcode-box center flex-col">
            <h3 className="student-name">{card.name}</h3>
            <div className="barcode-box">
              {barcodeValue ? (
                <Barcode
                  value={barcodeValue}
                  width={.92}
                  height={20}
                  fontSize={10}         // 👈 Controls text size below the barcode
                  displayValue={true}   // 👈 Shows value below
                  background="transparent"
                  lineColor="#000000"
                  margin={0}
                  flat={true}
                />

              ) : card.barcode ? (
                <img src={card.barcode} alt="Barcode" className="barcode-img" />
              ) : null}
            </div>
            {/* <div className="admission-id">{card.admissionId}</div> */}
          </li>
          <li className="course-department ">
            <span className="info-title">
              <p>Course/Stream:</p> 
              {/* {card.course} */}
              <span className="info-description">{card.course}</span>
            </span>
            <span className="info-title">
              Department: <span className="info-description">{card.department}</span>
            </span>
          </li>
        </ul>

        {/* <span className="authority-section">
          {card.authoritySignature && (
            <img src={card.authoritySignature} alt="Signature" className="authority-signature" />
          )}
          <p className="authority-text">{card.authorityText}</p>
        </span> */}

        <span className="authority-box">
          <img src={sign} alt="sign" className='sign' />
          <p className="authority-text">Issuing Authority register</p>
        </span>
      </div>

      {/* BACK SIDE */}
      <div className="pvc-card back">
        <ul className="back-info">
          <li className="info-title">
            Admission ID: <span className="info-description">{card.admissionId}</span>
          </li>
          <li className="info-title">
            Batch Year: <span className="info-description">{card.batchYear}</span>
          </li>
          <li className="info-title">
            Date of Birth: <span className="info-description">{card.dateOfBirth}</span>
          </li>
        </ul>

        <ul className="back-meta">
          <li className="info-title">
            Emergency Contact No.
            <span className="meta-description">{card.emergencyContact}</span>
          </li>
          <li className="info-title">
            Father's Name: <span className="meta-description">{card.fatherName}</span>
          </li>
          <li className="info-title">
            Address:
            <p className="meta-description">{card.address}</p>
          </li>
        </ul>

        <span className="back-meta center instruction" >
          Instructions
          <br />
          <p className='title'>Bring your card daily and present it when asked.
            Loss or damage of card must be reported.
          </p>
        </span>

        <ul className="university-info">
          <li className="university-name">{card.universityName || 'IIMT UNIVERSITY MEERUT'}</li>
          <li className="university-contact">tel: {card.universityContactTel || '0121-2793500-507'}</li>
          <li className="university-email">{card.universityContactEmail || 'mail@iimtindia.net'}</li>
        </ul>
      </div>
    </div>
  );
};





// const Template5: React.FC<PVCIdCardProps> = ({ card }) => {
//   const cardContainerStyle: React.CSSProperties = {
//     width: '205px',
//     position: 'relative',
//     height: '317px',
//     border: '1px solid rgb(19, 17, 17)',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '4px',
//     padding: '10px 10px 30px 10px',
//     flexShrink: 0,
//   };

//   const titleStyle: React.CSSProperties = {
//     lineHeight: '1.2', // Adjusted for better vertical spacing
//     display: 'flex',
//     fontWeight: 700,
//     fontSize: '.8rem', // Slightly reduced font size
//     alignItems: 'center',
//     wordBreak: 'break-word', // Ensure long words break
//   };

//   const titlePStyle: React.CSSProperties = {
//     display: 'inline',
//     fontWeight: 700,
//     marginLeft: '5px',
//     fontSize: '.65rem', // Slightly reduced font size
//     wordBreak: 'break-word',
//   };

//   const backTitlePStyle: React.CSSProperties = {
//     display: 'inline',
//     fontWeight: 600,
//     marginLeft: '5px',
//     fontSize: '.6rem', // Further reduced for back details
//     wordBreak: 'break-word',
//   };

//   const defaultBarcodeData = `${card.admissionId}`;
//   const longBarcodeData = card.barcodeDataString || defaultBarcodeData;

//   return (
//     <div
//       className="pvc-card text-slate-900" // Tailwind class for text color
//       style={{
//         background: 'linear-gradient(to right, #ffffff, #f7f7f7)',
//         borderRadius: '20px',
//         boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
//         display: 'flex',
//         padding: '30px',
//         position: 'relative',
//         gap: '10px',
//         overflow: 'hidden',
//         width: 'calc(2 * 205px + 2 * 30px + 10px)',
//         height: 'calc(317px + 2 * 30px)',
//       }}
//     >
//       {/* Front of the Card */}
//       <div className="card-container front" style={cardContainerStyle}>
//         <span>
//           <img
//             src={card.universityLogo || logo} // Using imported logo as fallback
//             className="logo-img"
//             alt="University Logo"
//             style={{ maxHeight: '70px' }}
//           />
//         </span>

//         <ul
//           className="card-info-list"
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%',
//             height: '100%',
//             alignItems: 'center',
//             gap: '4px',
//           }}
//         >
//           <li
//             className="avatar-container"
//             style={{
//               border: '2px solid #f87171',
//               borderRadius: '0.375rem',
//               overflow: 'hidden',
//               maxHeight: '100px',
//               maxWidth: '90px',
//               height: '100%',
//             }}
//           >
//             <img
//               src={card?.photo || 'https://www.shutterstock.com/image-photo/passport-photo-portrait-young-man-260nw-2437772333.jpg'}
//               alt="Student Photo"
//               className="avatar-img"
//               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//             />
//           </li>

//           <li
//             className="user-details"
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '0.25rem',
//               alignItems: 'center',
//             }}
//           >
//             <h3
//               className="user-name"
//               style={{
//                 color: '#ef4444',
//                 fontWeight: 500,
//                 fontSize: '.9rem', // Reduced student name font size
//                 wordBreak: 'break-word',
//                 textAlign: 'center', // Center align name for consistency
//               }}
//             >
//               {card.name}
//             </h3>
//             <div
//               style={{
//                 height: '30px',
//                 width: '100%',
//                 overflow: 'hidden',
//                 display: 'flex',
//                 justifyContent: 'center',
//               }}
//             >
//               {longBarcodeData && (
//                 <Barcode
//                   value={longBarcodeData}
//                   width={1}
//                   height={30}
//                   fontSize={8} // Slightly reduced barcode text font size
//                   displayValue={true}
//                   background="transparent"
//                   lineColor="#000000"
//                   margin={0}
//                   flat={true}
//                 />
//               )}
//               {/* Fallback for static image if barcodeDataString is not provided */}
//               {!longBarcodeData && card.barcode && (
//                 <img
//                   src={card.barcode}
//                   alt="Barcode"
//                   className="barcode-img"
//                   style={{ height: '30px', width: '100%' }}
//                 />
//               )}
//             </div>
//             {/* Displaying Admission ID below barcode as in your new code */}
//             <div style={{ fontSize: '.7rem', marginTop: '4px' }}>{card.admissionId}</div>
//           </li>

//           <li
//             className="user-meta"
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               width: '100%',
//               marginTop: 'auto',
//             }}
//           >
//             <span className="title" style={titleStyle}>
//               Course/Stream: <p style={titlePStyle}>{card.course}</p>
//             </span>
//             <span className="title" style={titleStyle}>
//               Department: <p style={titlePStyle}>{card.department}</p>
//             </span>
//           </li>
//         </ul>

//         <span
//           className="authority-box"
//           style={{
//             position: 'absolute',
//             bottom: '0',
//             right: '0',
//             width: '80px',
//             textAlign: 'center',
//             fontWeight: 'bold',
//             fontSize: '8px',
//             padding: '5px',
//           }}
//         >
//           {card.authoritySignature && (
//             <img
//               src={card.authoritySignature}
//               alt="Authority Signature"
//               style={{ width: '100%', height: 'auto' }}
//             />
//           )}
//           <p className="authority-text" style={{ textTransform: 'capitalize' }}>
//             {card.authorityText}
//           </p>
//         </span>
//       </div>

//       {/* Back of the Card */}
//       <div className="card-container front" style={cardContainerStyle}>
//         <ul style={{ width: '100%', marginTop: '10px' }}>
//           <li style={titleStyle}>
//             Admission ID : <p style={titlePStyle}>{card.admissionId}</p>
//           </li>
//           <li style={titleStyle}>
//             Batch Year : <p style={titlePStyle}>{card.batchYear}</p>
//           </li>
//           <li style={titleStyle}>
//             Date of Birth : <p style={titlePStyle}>{card.dateOfBirth}</p>
//           </li>
//         </ul>

//         <ul
//           className="back-title"
//           style={{ width: '100%', textAlign: 'center', marginTop: 'auto' }}
//         >
//           <li
//             style={titleStyle} // Reusing titleStyle for consistency, but will override specific P style
//             className="flex flex-col items-center justify-center"
//           >
//             Emergency Contact No.
//             <p style={backTitlePStyle}>{card.emergencyContact}</p>
//           </li>
//           <li
//             style={titleStyle}
//             className="flex flex-col items-center justify-center"
//           >
//             Father's Name : <p style={backTitlePStyle}>{card.fatherName}</p>
//           </li>
//           <li
//             style={titleStyle}
//             className="flex flex-col items-center justify-center"
//           >
//             Address:
//             <br />
//             <p
//               style={{
//                 ...backTitlePStyle,
//                 display: 'block',
//                 margin: '0',
//                 fontSize: '.6rem', // Further reduced for address
//                 lineHeight: '1.2',
//                 wordBreak: 'break-word',
//                 whiteSpace: 'normal',
//                 padding: '0 5px', // Added horizontal padding
//                 textAlign: 'center', // Ensure address is centered if it wraps
//               }}
//             >
//               {card.address}
//             </p>
//           </li>
//         </ul>

//         <ul style={{ width: '100%', marginBottom: '10px' }}>
//           <li
//             style={{ textTransform: 'uppercase', fontSize: '.75rem', textAlign: 'center' }} // Slightly reduced for university details
//           >
//             <h4 style={{ color: '#e92727', margin: '0 0 5px 0' }}>
//               {card?.universityName || 'IIMT UNIVERSITY MEERUT'}
//             </h4>
//             {1 && (
//               <p style={{ fontSize: '.65rem', margin: '0' }}>tel:{card?.universityContactTel || "0121-2793500-507"}</p> // Reduced
//             )}
//             {1 && (
//               <p style={{ fontSize: '.65rem', margin: '0' ,textTransform:"lowercase" }}>{card.universityContactEmail || "mail@iimtindia.net"}</p> // Reduced
//             )}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

export default Template5;