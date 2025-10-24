import { useEffect, useState } from 'react';
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import ApiHeader from "@/Components/api/ApiHeader";
import { toast } from "react-hot-toast";
import ProjectApiList from '@/Components/api/ProjectApiList';
import { decryptPassword } from './useEncDecr';

const UseCaptchaGeneratorServer = () => {
    const [captchaData, setCaptchaData] = useState({
        captcha_id: '',
        captcha_code: ''
    });
    const [captchaImage, setCaptchaImage] = useState("");
    const [loading, setLoading] = useState(false);
    const { api_getCaptcha } = ProjectApiList();

    const fetchCaptchaFromServer = async () => {
        setLoading(true);
        try {
            const response = await AxiosInterceptors.post(api_getCaptcha, {}, ApiHeader());

            // Log for debugging
            console.log('Captcha API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const { captcha_id, captcha_code } = response.data.data;

                setCaptchaData({
                    captcha_id,
                    captcha_code,
                });
                const descCaptcha = decryptPassword(captcha_code);

                drawCaptcha(descCaptcha);
            } else {
                toast.error('Invalid captcha response');
            }
        } catch (error) {
            console.error('Error fetching captcha:', error);
            toast.error('Failed to load captcha');
        } finally {
            setLoading(false);
        }
    };


    // Draw captcha on canvas
    const drawCaptcha = (captchaText) => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 60;
        const ctx = canvas.getContext("2d");

        // Background color
        ctx.fillStyle = "#E3F2FD";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add random curves & noise
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.bezierCurveTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.strokeStyle = `rgba(0, 0, 0, 0.3)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw text with random skew and rotation
        ctx.font = "bold 30px Arial";
        for (let i = 0; i < captchaText.length; i++) {
            ctx.save();
            const x = 20 + i * 30;
            const y = 40 + Math.random() * 10;
            const angle = (Math.random() - 0.5) * 0.6;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.9 + 0.1})`;
            ctx.fillText(captchaText[i], 0, 0);
            ctx.restore();
        }

        // Convert to Data URL
        setCaptchaImage(canvas.toDataURL());
    };

    // Verify captcha with server
    const verifyCaptcha = (userInput, resetForm) => {
        // Compare user input with captcha_code (case-insensitive)
        if (userInput.toUpperCase() === captchaData.captcha_code.toUpperCase()) {
            return true;
        } else {
            // Reset captcha field only
            resetForm({ captcha: '' }, false);
            fetchCaptchaFromServer(); // Generate new captcha
            return false;
        }
    };

    // Captcha text field component
    const catptchaTextField = (formik) => {
        return (
            <div>
                <input
                    className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600"
                    type='text'
                    {...formik?.getFieldProps("captcha")}
                />
                <span className="text-red-600 text-xs">
                    {formik?.touched?.captcha && formik?.errors?.captcha
                        ? formik?.errors?.captcha
                        : null}
                </span>
            </div>
        );
    };

    // Load captcha on mount
    useEffect(() => {
        fetchCaptchaFromServer();
    }, []);

    return {
        catptchaTextField,
        captchaData,
        captchaImage,
        verifyCaptcha,
        newGeneratedCaptcha: fetchCaptchaFromServer,
        loading
    };
};

export default UseCaptchaGeneratorServer;