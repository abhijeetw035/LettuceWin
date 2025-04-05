"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LiveTranscriptionProps {
	isRecording: boolean;
	onTranscriptUpdate?: (transcript: string) => void;
}

export default function LiveTranscription({ isRecording, onTranscriptUpdate }: LiveTranscriptionProps) {
	const [transcript, setTranscript] = useState("");
	const [interimTranscript, setInterimTranscript] = useState("");
	const [error, setError] = useState("");
	const recognitionRef = useRef<any>(null);

	// Initialize speech recognition
	useEffect(() => {
		// Check if browser supports SpeechRecognition
		const SpeechRecognition =
			window.SpeechRecognition || (window as any).webkitSpeechRecognition;

		if (SpeechRecognition) {
			const speechRecognition = new SpeechRecognition();
			speechRecognition.continuous = true;
			speechRecognition.interimResults = true;
			speechRecognition.lang = "en-US";

			speechRecognition.onresult = (event: any) => {
				let interimText = "";
				let finalText = "";

				for (let i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						finalText += event.results[i][0].transcript;
					} else {
						interimText += event.results[i][0].transcript;
					}
				}

				// Update final transcript when available
				if (finalText) {
					setTranscript(prev => {
						const updatedTranscript = prev + finalText + " ";
						// If parent component wants to be updated on transcript changes
						if (onTranscriptUpdate) {
							onTranscriptUpdate(updatedTranscript);
						}
						return updatedTranscript;
					});
					setInterimTranscript("");
				}

				// Update interim text for live feedback
				if (interimText) {
					setInterimTranscript(interimText);
				}
			};

			speechRecognition.onerror = (event: any) => {
				console.error("Recognition error:", event.error);
				setError(`Error: ${event.error}`);
			};

			speechRecognition.onend = () => {
				// Try to restart if we're still supposed to be recording
				if (isRecording) {
					try {
						speechRecognition.start();
					} catch (e) {
						console.error("Could not restart speech recognition:", e);
					}
				}
			};

			recognitionRef.current = speechRecognition;
		} else {
			setError("Speech recognition not supported in this browser. Try Chrome.");
		}

		// Cleanup on unmount
		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (e) {
					// Ignore errors on cleanup
				}
			}
		};
	}, [onTranscriptUpdate]);

	// Handle recording state changes
	useEffect(() => {
		if (!recognitionRef.current) return;

		if (isRecording) {
			setTranscript("");
			setInterimTranscript("");
			try {
				// Check if recognition is already running before starting
				if (recognitionRef.current.state !== "running") {
					recognitionRef.current.start();
				}
			} catch (e) {
				console.error("Could not start speech recognition:", e);
				// Recreate the recognition instance if there was an error
				const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
				if (SpeechRecognition) {
					const newRecognition = new SpeechRecognition();
					// Re-configure the new instance
					newRecognition.continuous = true;
					newRecognition.interimResults = true;
					newRecognition.lang = "en-US";
					// Reassign all event handlers
					// ... (copy the event handlers from the initialization code)
					recognitionRef.current = newRecognition;
					try {
						newRecognition.start();
					} catch (retryErr) {
						console.error("Failed to restart recognition:", retryErr);
					}
				}
			}
		} else if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch (e) {
				console.error("Could not stop speech recognition:", e);
			}
		}
	}, [isRecording]);

	if (error) {
		return (
			<div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-sm text-red-300 w-full mt-4">
				<div className="font-medium mb-1">Transcription Error</div>
				{error}
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="w-full mt-6"
		>
			<div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
				<div className="flex items-center mb-2">
					{isRecording && (
						<div className="flex items-center text-cyan-400 text-sm">
							<div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></div>
							Live Transcription
						</div>
					)}
				</div>
				<div className="text-slate-200 min-h-[100px] max-h-[200px] overflow-y-auto text-sm leading-relaxed p-2">
					{transcript || interimTranscript ? (
						<p>
							{transcript}
							<span className="text-slate-400">{interimTranscript}</span>
						</p>
					) : (
						<p className="text-slate-400 italic">
							{isRecording
								? "Speak now... your response will appear here."
								: "Start recording to see live transcription"}
						</p>
					)}
				</div>
			</div>
		</motion.div>
	);
}