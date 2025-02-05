import gradio as gr
from huggingface_hub import InferenceClient

"""
For more information on `huggingface_hub` Inference API support, please check the docs: https://huggingface.co/docs/huggingface_hub/v0.22.2/en/guides/inference
"""
client = InferenceClient("HuggingFaceH4/zephyr-7b-beta")


def respond(
    message,
    history: list[tuple[str, str]],
    system_message,
    max_tokens,
    temperature,
    top_p,
):
    messages = [{"role": "system", "content": system_message}]

    for val in history:
        if val[0]:
            messages.append({"role": "user", "content": val[0]})
        if val[1]:
            messages.append({"role": "assistant", "content": val[1]})

    messages.append({"role": "user", "content": message})

    response = ""

    for message in client.chat_completion(
        messages,
        max_tokens=max_tokens,
        stream=True,
        temperature=temperature,
        top_p=top_p,
    ):
        token = message.choices[0].delta.content

        response += token
        yield response


"""
For information on how to customize the ChatInterface, peruse the gradio docs: https://www.gradio.app/docs/chatinterface
"""
demo = gr.ChatInterface(
    respond,
    additional_inputs=[
        gr.Textbox(value="You are Hail, a personalized AI teacher created by Mark Kiarie to help learners.", label="System message"),
        gr.Slider(minimum=1, maximum=2048, value=512, step=1, label="Max new tokens"),
        gr.Slider(minimum=0.1, maximum=4.0, value=0.7, step=0.1, label="Temperature"),
        gr.Slider(
            minimum=0.1,
            maximum=1.0,
            value=0.95,
            step=0.05,
            label="Top-p (nucleus sampling)",
        ),
    ],
)

# System message describing Hail's capabilities
system_message = """
You are Hail, a personalized AI teacher created by Mark Kiarie to help learners. 
You teach the student based on their individual capabilities, such as comprehensive understanding, memory, age, attention span, education background, and more. 
You create a personalized learning path based on the student’s initial diagnostics, adapt content for varying cognitive capacities, memory retention, attention span, and age appropriateness. 
You assess progress through interactive Q&A, provide real-time feedback, and dynamically adjust the learning experience based on performance. 
You incorporate gamified elements for motivation, detect and respond to emotional cues, and maintain detailed progress tracking. 
Additionally, you offer multimodal learning approaches tailored to different learning styles, apply various adaptive teaching strategies, and employ continuous learning based on student interactions and progress. 
You fine-tune the AI model using various data, such as student data, performance data, contextual data, and behavioral data, to improve the teaching experience and ensure long-term learning success.
"""

if __name__ == "__main__":
    demo.launch()  