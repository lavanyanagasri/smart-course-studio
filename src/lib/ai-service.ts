import { LessonContent, LessonInput } from "@/types/lesson";

// This function will call the OpenAI API to generate lesson content
export async function generateLesson(input: LessonInput): Promise<LessonContent> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key')}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate a structured lesson based on the provided information. Return ONLY valid JSON conforming to the LessonContent interface."
          },
          {
            role: "user",
            content: `Create a lesson with the following details:
              Title: ${input.title || "Introduction to the Topic"}
              Topic: ${input.topic}
              Description: ${input.description || ""}
              Target Audience: ${input.targetAudience || "students"}
              Difficulty Level: ${input.difficultyLevel || "beginner"}
              Additional Instructions: ${input.additionalInstructions || ""}
              
              The response should be a valid JSON object with the following structure:
              {
                "title": string,
                "description": string,
                "learningOutcomes": string[],
                "keyConcepts": Array<{term: string, definition: string}>,
                "content": {
                  "introduction": string,
                  "sections": Array<{title: string, content: string}>,
                  "conclusion": string
                },
                "activities": Array<{title: string, description: string, type: "discussion" | "exercise" | "quiz" | "project"}>,
                "assessment": {
                  "questions": Array<{question: string, options?: string[], answer?: string}>
                },
                "resources": Array<{title: string, url?: string, description: string}>
              }
              `
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the JSON content from the response
    const content = data.choices[0].message.content;
    let parsedContent: LessonContent;
    
    try {
      // Try to parse the content as JSON directly
      parsedContent = JSON.parse(content);
    } catch (e) {
      // In case the model returns markdown or other format, extract JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse OpenAI response as JSON");
      }
    }

    return parsedContent;
  } catch (error) {
    console.error("Error generating lesson:", error);
    
    // Fallback to mock data if API call fails
    return fallbackGenerateLesson(input);
  }
}

// Fallback function that returns mock data when the API call fails
function fallbackGenerateLesson(input: LessonInput): LessonContent {
  // Return mock data based on input
  return {
    title: input.title || "Introduction to the Topic",
    description: input.description || `A comprehensive introduction to ${input.topic} designed for ${input.targetAudience || 'students'}.`,
    learningOutcomes: [
      `Understand the fundamental concepts of ${input.topic}`,
      `Apply basic principles of ${input.topic} to solve problems`,
      `Analyze and evaluate ${input.topic}-related scenarios`,
      `Create simple solutions using ${input.topic} methodologies`
    ],
    keyConcepts: [
      {
        term: `${input.topic} Fundamentals`,
        definition: `The core principles and concepts that form the foundation of ${input.topic}.`
      },
      {
        term: "Practical Application",
        definition: `Methods for applying ${input.topic} concepts in real-world scenarios.`
      },
      {
        term: "Analytical Framework",
        definition: `A structured approach to analyzing and solving problems in ${input.topic}.`
      }
    ],
    content: {
      introduction: `Welcome to this lesson on ${input.topic}. This lesson is designed for ${input.targetAudience || 'students'} at a ${input.difficultyLevel || 'beginner'} level. In this lesson, we will explore the fundamental concepts, practical applications, and analytical frameworks associated with ${input.topic}.`,
      sections: [
        {
          title: "Understanding the Basics",
          content: `In this section, we'll cover the foundational knowledge needed to understand ${input.topic}. We'll start with definitions, historical context, and the significance of these concepts in the broader field.`
        },
        {
          title: "Core Principles",
          content: `Here we'll delve into the main principles that govern ${input.topic}. Understanding these principles is crucial for developing a solid grasp of the subject matter and applying it effectively in various contexts.`
        },
        {
          title: "Practical Applications",
          content: `This section focuses on how ${input.topic} is applied in real-world scenarios. We'll explore case studies, examples, and practical techniques that demonstrate the utility and relevance of these concepts in solving actual problems.`
        }
      ],
      conclusion: `In conclusion, ${input.topic} represents an important area of study with significant implications for various fields. By understanding the fundamental concepts, principles, and applications covered in this lesson, you are now better equipped to engage with this subject matter at a more advanced level.`
    },
    activities: [
      {
        title: "Concept Mapping",
        description: `Create a concept map illustrating the key relationships between the main ideas in ${input.topic}.`,
        type: "exercise"
      },
      {
        title: "Case Study Analysis",
        description: `Analyze a case study related to ${input.topic} and identify how the principles we've discussed apply in that scenario.`,
        type: "discussion"
      },
      {
        title: "Knowledge Check",
        description: `A brief quiz to assess your understanding of ${input.topic} fundamentals.`,
        type: "quiz"
      }
    ],
    assessment: {
      questions: [
        {
          question: `What are the primary components of ${input.topic}?`,
          options: [
            "Component A, Component B, Component C",
            "Element X, Element Y, Element Z",
            "Framework 1, Framework 2, Framework 3",
            "None of the above"
          ],
          answer: "Component A, Component B, Component C"
        },
        {
          question: `How is ${input.topic} applied in real-world scenarios?`,
          options: [
            "Through theoretical models only",
            "Through practical implementation strategies",
            "It's purely academic with no practical applications",
            "Through regulatory frameworks exclusively"
          ],
          answer: "Through practical implementation strategies"
        },
        {
          question: `Explain the relationship between ${input.topic} and related fields.`,
        }
      ]
    },
    resources: [
      {
        title: "Recommended Textbook",
        description: `"Understanding ${input.topic}" - A comprehensive introduction to the subject.`,
      },
      {
        title: "Online Course",
        description: `"${input.topic} Fundamentals" - An interactive course covering all key concepts.`,
        url: "https://example.com/course"
      },
      {
        title: "Research Paper",
        description: `"Recent Advances in ${input.topic}" - Cutting-edge research and developments.`,
        url: "https://example.com/research"
      }
    ]
  };
}
