
// import type { NextApiRequest, NextApiResponse } from "next";
// import axios, { AxiosError } from "axios";

// interface MLResponse {
//   prediction: string;
//   confidence?: number;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URI_DEV;

//   if (!mlApiUrl) {
//     return res.status(500).json({ message: "ML API URI not configured" });
//   }

//   try {
//     const { ingredient, dose } = req.body;

//     const mlResponse = await axios.post<MLResponse>(
//       mlApiUrl,
//       {
//         food: [{ ingredient, dose }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }
//     );

//     res.status(200).json(mlResponse.data);
//   } catch (error) {
//     const axiosError = error as AxiosError<{ message?: string }>;
//     const message = axiosError.response?.data?.message || "ML API error";
//     res.status(500).json({ message });
//   }
// }
