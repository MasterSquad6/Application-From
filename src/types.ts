/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Step = 1 | 2 | 3 | 4;

export interface ApplicationData {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  gender: string;
  position: string;
  experience: string;
  workType: string;
  hoursPerDay: number;
  previousCompany: string;
  bio: string;
  platforms: string[];
  skills: string[];
  tools: string[];
  englishRating: number;
  salaryExpectation: string;
  facebookLink: string;
  agree: boolean;
  imageUrls: Record<string, string>;
}

export interface ApplicationStatus {
  id: string;
  displayId: string;
  password?: string;
  status: string;
  adminNote?: string;
  fullName: string;
  position: string;
  submittedAt?: any;
}
