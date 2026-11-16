import { z } from "zod";

export const submissionSchema = z.object({
  contestSlug: z
    .string()
    .trim()
    .min(1, "Contest slug is required.")
    .max(100),
  guardianName: z
    .string()
    .trim()
    .min(2, "Please enter the parent or legal guardian's full name.")
    .max(100, "Guardian name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(160),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => val.replace(/[\s\-\(\)\+]/g, "").length >= 10,
      "Please enter a valid phone number (at least 10 digits).",
    )
    .refine((val) => val.length <= 24, "Phone number is too long."),
  addressStreet: z
    .string()
    .trim()
    .min(5, "Please enter your street/house address (at least 5 characters).")
    .max(200, "Address is too long."),
  city: z
    .string()
    .trim()
    .min(2, "Please enter your city or district.")
    .max(80, "City name is too long."),
  state: z
    .string()
    .trim()
    .min(2, "Please select your state."),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit postal pincode."),
  childDisplayName: z
    .string()
    .trim()
    .min(2, "Please enter your child's display name (at least 2 characters).")
    .max(60, "Child display name must be 60 characters or less."),
  childDateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date of birth.")
    .refine((val) => {
      const dob = new Date(`${val}T00:00:00Z`);
      if (isNaN(dob.getTime())) return false;
      const now = new Date();
      return dob <= now;
    }, "Date of birth cannot be in the future.")
    .refine((val) => {
      const dob = new Date(`${val}T00:00:00Z`);
      if (isNaN(dob.getTime())) return false;
      const now = new Date();
      const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      return dob >= twoYearsAgo;
    }, "Baby must be 24 months (2 years) or younger to participate."),
  ageCategory: z.enum(
    ["under-6-months", "under-12-months", "up-to-24-months"],
    {
      message: "Please select an age category.",
    },
  ),
  consentGuardian: z.literal(true, {
    message: "Parent or legal guardian consent is required.",
  }),
  consentSharing: z.literal(true, {
    message: "Public sharing consent is required.",
  }),
  consentRules: z.literal(true, {
    message: "Contest rules and privacy policy acceptance is required.",
  }),
});

export type ValidatedSubmissionInput = z.infer<typeof submissionSchema>;

