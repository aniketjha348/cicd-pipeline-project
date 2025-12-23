// validators/course.validator.js
import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(2),
  departmentId: z.string(),
  collegeId: z.string(),
  universityId: z.string(),
  duration: z.number().min(1),
  code:z.string(),
  description: z.string().optional(),
  programType: z.enum(["Undergraduate", "Postgraduate", "Diploma", "Certificate"]),
  batches: z
    .array(
      z.object({
        batchYear: z.number(),
        endYear: z.number().optional(),
        years: z.array(
          z.object({
            yearNumber: z.number(),
            sections: z.array(
              z.object({
                name: z.string(),
                capacity: z.number(),
                classTeacherId: z.string().optional(),
              })
            ),
          })
        ),
      })
    )
    .optional(),
});