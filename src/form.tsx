import { FormEvent, JSX } from "react";

export const Form = (props: {
    submit: (ev: FormEvent) => void;
    inputs: {
        label: string;
        element: JSX.Element;
    }[];
    button: {
        text: string
    };
    error: {
        message: string | null
    }
}) => {

    const { submit, inputs, button, error } = props;

    return (
        <form className="flex flex-col gap-4 p-4 border border-gray-300 rounded-md mb-6  w-full [&>div]:flex [&>div]:flex-col [&>div]:gap-2" onSubmit={submit}>
            {
                inputs.map((input) => {
                    return (
                        <div key={input.label}>
                            <label>
                                {
                                    input.label
                                }:
                            </label>
                            {
                                input.element
                            }
                        </div>
                    )
                })
            }
            <button type="submit">
              {
                button.text
              }
            </button>
            {
              error.message && <div>{
                error.message
                }</div> 
            }
        </form>
    )
}