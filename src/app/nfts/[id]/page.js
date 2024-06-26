"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button, Navbar } from '@/components'
const NFTPage = ({ params }) => {
    const id = params?.id;


    const [activeTab, setActiveTab] = useState('Color');

    const tabs = ['Color', 'Size', 'Weight', 'Material', 'Usage', 'Unique Qualities', 'Manufacturer', 'Made In'];

    const handleClaimClick = () => {
        setShowPopover(true);
        setTimeout(() => {
            setShowPopover(false);
        }, 6000); // Pop-over will disappear after 3 seconds
    };

    const apiUrl = process.env.NEXT_PUBLIC_URI;

    const [onephygital, setonePhygital] = useState([]);

    const getBrands = async () => {

        const phyres = await fetch(`${apiUrl}/collections${id}`)

        const phyresult = await phyres.json()

        console.log(phyresult);
        setonePhygital(phyresult);
    }

    useEffect(() => {
        getBrands()
    }, [])

    return (
        <div>
            <div className="px-10" style={{ display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(90deg, #DF1FDD8A, #30D8FFAB, #5347E7AB)', paddingBottom: '10px' }}>
                <Navbar />
                <div
                    style={{
                        position: 'absolute',
                        top: '110%',
                        left: '80%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#D9D8D8',
                        color: 'black',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '15px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 20,
                        width: '300px',

                    }}
                >
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <img src="../slider3 metallic suit small 2.png" style={{ width: '80px', borderRadius: '100px' }} />
                        <div className="font-bold mt-6">{onephygital.brand_name}</div>
                    </div>
                    <div className="mt-4" style={{ fontSize: '13px' }}>{onephygital.description}</div>
                </div>
            </div>
            <div className="flex gap-10 mt-10 px-10">
                <div className="w-1/3">
                    <img
                        src={onephygital?.image}
                        style={{ width: "70vh", height: "70vh" }}
                    />
                </div>
                <div
                    style={{
                        border: "1px solid #0000004D",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                        paddingTop: "50px",
                        width: "120vh",
                        height: "70vh",
                    }}
                    className="w-2/3"
                >
                    <div className="text-4xl font-bold">{onephygital.brand_name}</div>
                    <div className="text-lg mt-10 font-bold">Base Network</div>
                    <div className="mt-4">Created by {onephygital.manager_id}</div>
                </div>
            </div>

            <div className="flex gap-10 mt-4 px-10" style={{ marginBottom: "30px" }}>
                <div className="w-1/3" style={{ width: "70vh" }}>
                    <div
                        style={{
                            border: "1px solid #0000004D",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            paddingTop: "30px",
                            paddingBottom: "60px",
                        }}
                    >
                        <div className="text-4xl font-bold">Description</div>
                        <div className="mt-10">
                            {onephygital?.description}
                        </div>
                    </div>
                    <div
                        className="mt-4"
                        style={{
                            border: "1px solid #0000004D",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            paddingTop: "30px",
                            paddingBottom: "30px",
                        }}
                    >
                        <div className="text-2xl font-bold">NFT Details </div>
                        <div
                            style={{ justifyContent: "space-between", display: "flex" }}
                            className="mt-10"
                        >
                            <div>Contact Address</div>
                            <div>{onephygital?.contractAddress}</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Token ID</div>
                            <div>Token ID</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Token Standard</div>
                            <div>ERC-721A</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Chain</div>
                            <div>Base Chain</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Date Created</div>
                            <div>date</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Last Sale</div>
                            <div>sale date</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Last Updated</div>
                            <div>update date (avatar also)</div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                            <div>Creator Earnings</div>
                            <div>{onephygital?.royalty} %</div>
                        </div>
                    </div>
                </div>

                <div className="w-2/3" style={{ width: "120vh" }}>
                    <div
                        style={{
                            border: "1px solid #0000004D",
                            paddingLeft: "40px",
                            paddingRight: "40px",
                            paddingTop: "30px",
                            paddingBottom: "60px",
                        }}
                    >
                        <div className="text-4xl font-bold">WebXR</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="w-1/2">
                                <button
                                    className="rounded"
                                    style={{
                                        background: "transparent",
                                        border: "6px solid transparent",
                                        borderRadius: "8px",
                                        backgroundImage: `
              linear-gradient(white, white),
              linear-gradient(to right, #AF40FF, #5B42F3, #00DDEB)
            `,
                                        backgroundOrigin: "border-box",
                                        backgroundClip: "content-box, border-box",
                                        WebkitBackgroundClip: "content-box, border-box", // For Safari
                                        color: "black", // Adjust text color to match your design
                                        cursor: "pointer",
                                        fontSize: "1.1rem",
                                        width: "250px",
                                        height: "50px", // Set fixed width for the button
                                        display: "block",
                                        marginTop: "40px", // Center the button
                                    }}
                                >
                                    Experience
                                </button>
                                <div className="mt-10">
                                    Access the WebXR experience to ask questions about the brand,
                                    the product, and more!{" "}
                                </div>
                            </div>
                            <div style={{ margin: '0 auto', display: "block" }}>
                                <div className="text-center">Avatar Image</div>
                                <img
                                    src="../slider3 metallic suit small 2.png"
                                    style={{ width: "200px", marginTop: '10px' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-4"
                        style={{
                            border: "1px solid #0000004D",
                            paddingLeft: "40px",
                            paddingRight: "40px",
                            paddingTop: "30px",
                            paddingBottom: "30px",
                        }}
                    >
                        <div className="text-2xl font-bold">Additional Product details</div>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '10px 4px',
                                        borderRight: activeTab === tab ? '1px solid black' : '',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div style={{ paddingTop: '10px', borderTop: '1px solid black' }}>
                            {activeTab === 'Color' && <p>{onephygital?.colours}</p>}
                            {activeTab === 'Size' && <p>{onephygital?.size}</p>}
                            {activeTab === 'Weight' && <p>{onephygital?.weight}</p>}
                            {activeTab === 'Material' && <p>{onephygital?.material}</p>}
                            {activeTab === 'Usage' && <p>{onephygital?.usage}</p>}
                            {activeTab === 'Unique Qualities' && <p>{onephygital?.uniqueQuality}</p>}
                            {activeTab === 'Manufacturer' && <p>{onephygital?.manufacturer}</p>}
                            {activeTab === 'Made In' && <p>{onephygital?.madeIn}</p>}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTPage;
