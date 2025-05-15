// // App.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
// import CountryExplorer from "./pages/CountryExplorer";
// import CountryFlagGame from "./pages/Country-flag-quiz";
// import { SignIn, SignUp } from "@clerk/clerk-react";

// function App() {
//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <>
//             <SignedIn>
//               <CountryExplorer />
//             </SignedIn>
//             <SignedOut>
//               <RedirectToSignIn />
//             </SignedOut>
//           </>
//         }
//       />
//       <Route
//         path="/quiz"
//         element={
//           <>
//             <SignedIn>
//               <CountryFlagGame />
//             </SignedIn>
//             <SignedOut>
//               <RedirectToSignIn />
//             </SignedOut>
//           </>
//         }
//       />
//       <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
//       <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
//     </Routes>
//   );
// }

// export default App;


// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
// import CountryExplorer from "./pages/CountryExplorer";
import CountryFlagGame from "./pages/Country-flag-quiz";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<CountryExplorer />} /> */}
      <Route path="/" element={<CountryFlagGame />} />
    </Routes>
  );
}

export default App;
