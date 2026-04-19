const ProfileImg = ({url, size}) => {
    return (
        <div
            style={{
                width: size === "small" ? 42 : 64,
                height: size === "small" ? 42 : 64,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #4E4E4E",
                backgroundColor: "#00000060",
                flexShrink: 0,
            }}
        >
            <img
                src={url}
                alt="Avatar"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                }}
            />
        </div>
    );
};

export default ProfileImg;