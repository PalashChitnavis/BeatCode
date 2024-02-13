/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useBody } from "../../context/BodyContext";
const ShareCode = () => {
        const { body } = useBody();
        const [share, setShare] = useState(false);
        function handleClick() {
                setShare(!share);
        }

        const styles = StyleSheet.create({
                page: {
                        flexDirection: "column",
                        padding: 20,
                },
                section: {
                        marginBottom: 10,
                },
                code: {
                        fontFamily: "Courier",
                        fontSize: 12,
                        backgroundColor: "#f0f0f0",
                        padding: 5,
                },
        });

        const MyDocument = () => (
                <Document>
                        <Page size="A4" style={styles.page}>
                                <View style={styles.section}>
                                        <Text style={styles.code}>{body.code}</Text>
                                </View>
                                <View style={styles.section}>
                                        <Text>User Input: {body.userInput}</Text>
                                </View>
                                <View style={styles.section}>
                                        <Text>Output: {body.output}</Text>
                                </View>
                                <View style={styles.section}>
                                        <Text>Language: {body.language}</Text>
                                </View>
                        </Page>
                </Document>
        );

        return (
                <div
                        onClick={handleClick}
                        className="w-[80%] h-[100%] flex justify-center items-center bg-[#bcbcbc] rounded-xl cursor-pointer"
                >
                        <div className="w-[80%] text-xl flex justify-center items-center text-[#000]">Share</div>
                        <div className="w-[20%] flex justify-center items-center pr-5">
                                <i className="fa-solid fa-user-plus " style={{ color: "#000" }} aria-hidden="true"></i>
                        </div>
                        {share && (
                                <div>
                                        <div
                                                className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[1000] left-0 top-0"
                                                onClick={handleClick}
                                        ></div>
                                        <div className=" fixed -translate-x-2/4 -translate-y-2/4 z-[1001] w-[60vw] h-[80vh] bg-[#2f3136] border shadow-[0_0_10px_rgba(0,0,0,0.2)] p-5 rounded-[10px] border-solid border-[#ccc] left-2/4 top-2/4">
                                                <div className="w-full h-[80%]">
                                                        <PDFViewer width="100%" height="100%">
                                                                <MyDocument />
                                                        </PDFViewer>
                                                </div>
                                                <div>
                                                        <PDFDownloadLink document={<MyDocument />} fileName="code.pdf">
                                                                {({ blob, url, loading, error }) =>
                                                                        loading ? "Loading..." : "Download PDF"
                                                                }
                                                        </PDFDownloadLink>
                                                </div>
                                                <div className="flex w-[100%] justify-center">
                                                        <button>Create Room</button>
                                                        <button>Join Room</button>
                                                </div>
                                                <button
                                                        onClick={handleClick}
                                                        className="w-[5vw] h-10  font-[bold] cursor-pointer font-bold transition-all duration-[0.3s] ease-[ease] text-[#d90429] ml-[45%] rounded-[5px] border-4 border-solid border-[#d90429]
                                                        bg-white hover:bg-[#d90429] hover:text-[#fff] font-sans"
                                                >
                                                        Close
                                                </button>
                                        </div>{" "}
                                </div>
                        )}
                </div>
        );
};

export default ShareCode;
