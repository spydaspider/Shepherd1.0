const crypto = require("crypto");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");


// =====================================
// Register User
// =====================================

const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dateOfBirth
        } = req.body;

        const cleanFirstName = firstName?.trim();

        const cleanLastName = lastName?.trim();

        const cleanEmail = email
            ? email.trim().toLowerCase()
            : undefined;

        const cleanPhone = phone
            ? phone.trim()
            : undefined;


        if (
            !cleanFirstName ||
            !cleanLastName ||
            !password ||
            !gender
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, password and gender are required"
            });
        }


        if (!cleanEmail && !cleanPhone) {
            return res.status(400).json({
                success: false,
                message:
                    "Email or phone number is required"
            });
        }


        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }


        // =====================================
        // Check email
        // =====================================

        if (cleanEmail) {

            const emailExists = await User.findOne({
                email: cleanEmail
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }


        // =====================================
        // Check phone
        // =====================================

        if (cleanPhone) {

            const phoneExists = await User.findOne({
                phone: cleanPhone
            });

            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: "Phone already exists"
                });
            }
        }


        // =====================================
        // Create user
        // =====================================

        const user = await User.create({

            firstName: cleanFirstName,

            lastName: cleanLastName,

            email: cleanEmail,

            phone: cleanPhone,

            password,

            gender,

            dateOfBirth: dateOfBirth || null,

            hasAccount: true,

            loginEnabled: true,

            mustChangePassword: false,

            accountCreatedAt: new Date(),

            role: "Member",

            membershipType: "Member",

            status: "Active",

            isActive: true,

            registrationSource: "Online"
        });


        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

            token:
                generateToken(user),

            user: {

                id: user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email || null,

                phone:
                    user.phone || null,

                role:
                    user.role,

                mustChangePassword:
                    user.mustChangePassword
            }
        });


    } catch (error) {

        console.error(
            "REGISTER USER ERROR:",
            error
        );


        if (error.code === 11000) {

            const duplicateField =
                Object.keys(
                    error.keyPattern || {}
                )[0];

            return res.status(400).json({

                success: false,

                message:
                    `${duplicateField || "Email or phone"} already exists`
            });
        }


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};



// =====================================
// Admin Creates Login Account
// =====================================

const createMemberAccount = async (req, res) => {

    try {

        const member =
            await User.findById(
                req.params.id
            );


        if (!member) {

            return res.status(404).json({

                success: false,

                message:
                    "Member not found"
            });
        }


        if (member.isChild) {

            return res.status(400).json({

                success: false,

                message:
                    "Children cannot have independent login accounts"
            });
        }


        if (member.hasAccount) {

            return res.status(400).json({

                success: false,

                message:
                    "Member already has an account"
            });
        }


        if (
            !member.email &&
            !member.phone
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Member must have an email or phone number before an account can be created"
            });
        }


        let generatedPassword =
            req.body.password;


        if (!generatedPassword) {

            generatedPassword =
                Math.random()
                    .toString(36)
                    .slice(2, 8) +
                Math.floor(
                    Math.random() * 100
                );
        }


        if (generatedPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"
            });
        }


        member.password =
            generatedPassword;

        member.hasAccount =
            true;

        member.loginEnabled =
            true;

        member.mustChangePassword =
            true;

        member.accountCreatedAt =
            new Date();

        member.accountCreatedBy =
            req.user._id;

        member.registrationSource =
            "Admin";

        member.isVerified =
            false;

        member.phoneVerified =
            false;


        await member.save();


        return res.status(200).json({

            success: true,

            message:
                "Login account created successfully",

            temporaryPassword:
                generatedPassword,

            member: {

                id:
                    member._id,

                name:
                    `${member.firstName} ${member.lastName}`,

                email:
                    member.email || null,

                phone:
                    member.phone || null,

                loginEnabled:
                    member.loginEnabled,

                mustChangePassword:
                    member.mustChangePassword
            }
        });


    } catch (error) {

        console.error(
            "CREATE MEMBER ACCOUNT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};



// =====================================
// Login User
// =====================================

const loginUser = async (req, res) => {

    try {

        const {
            identifier,
            password
        } = req.body;


        if (
            !identifier ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number and password are required"
            });
        }


        const cleanIdentifier =
            identifier.trim();


        const isEmail =
            cleanIdentifier.includes("@");


        let user;


        // =====================================
        // Email login
        // =====================================

        if (isEmail) {

            user =
                await User.findOne({

                    email:
                        cleanIdentifier.toLowerCase(),

                    hasAccount: true,

                    loginEnabled: true

                }).select("+password");


        } else {

            // =====================================
            // Phone login
            // =====================================

            user =
                await User.findOne({

                    phone:
                        cleanIdentifier,

                    hasAccount: true,

                    loginEnabled: true

                }).select("+password");
        }


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/phone or password"
            });
        }


        const match =
            await user.matchPassword(
                password
            );


        if (!match) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email/phone or password"
            });
        }


        user.lastLogin =
            new Date();


        await user.save();


        return res.json({

            success: true,

            message:
                "Login successful",

            token:
                generateToken(user),

            user: {

                id:
                    user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email || null,

                phone:
                    user.phone || null,

                role:
                    user.role,

                mustChangePassword:
                    user.mustChangePassword
            }
        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};



// =====================================
// Change Password
// =====================================

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        // =====================================
        // Validate request
        // =====================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password, new password and confirmation are required"
            });
        }


        if (newPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters"
            });
        }


        if (
            newPassword !== confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New passwords do not match"
            });
        }


        // =====================================
        // Get logged-in user
        // =====================================

        const user =
            await User.findById(
                req.user._id
            ).select("+password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"
            });
        }


        if (
            !user.hasAccount ||
            !user.loginEnabled
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is not enabled for login"
            });
        }


        // =====================================
        // Verify current password
        // =====================================

        const passwordMatches =
            await user.matchPassword(
                currentPassword
            );


        if (!passwordMatches) {

            return res.status(401).json({

                success: false,

                message:
                    "Current password is incorrect"
            });
        }


        // =====================================
        // Prevent same password
        // =====================================

        const samePassword =
            await user.matchPassword(
                newPassword
            );


        if (samePassword) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from your current password"
            });
        }


        // =====================================
        // Save new password
        // =====================================

        user.password =
            newPassword;

        user.mustChangePassword =
            false;

        user.loginEnabled =
            true;


        await user.save();


        // =====================================
        // Return fresh token
        // =====================================

        return res.status(200).json({

            success: true,

            message:
                "Password changed successfully",

            token:
                generateToken(user),

            user: {

                id:
                    user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email || null,

                phone:
                    user.phone || null,

                role:
                    user.role,

                mustChangePassword:
                    user.mustChangePassword
            }
        });


    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};



// =====================================================
// Forgot Password
// POST /api/auth/forgot-password
// =====================================================

const forgotPassword = async (req, res) => {

    try {
        console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FORGOT PASSWORD CONTROLLER REACHED");

        const {
            identifier
        } = req.body;


        // =====================================
        // Validate identifier
        // =====================================

        if (!identifier) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number is required"
            });
        }


        const cleanIdentifier =
            identifier.trim();


        const isEmail =
            cleanIdentifier.includes("@");


        let user;


        // =====================================
        // Find by email
        // =====================================

        if (isEmail) {

            user =
                await User.findOne({

                    email:
                        cleanIdentifier.toLowerCase(),

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                });


        } else {

            // =====================================
            // Find by phone
            // =====================================

            user =
                await User.findOne({

                    phone:
                        cleanIdentifier,

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                });
        }


        // =====================================
        // Generic response
        // Prevent account enumeration
        // =====================================

        if (!user) {
              console.log("FORGOT PASSWORD: USER NOT FOUND");
    console.log("Identifier:", cleanIdentifier);

            return res.status(200).json({

                success: true,

                message:
                    "If an account exists, a password reset code has been sent."
            });
        }


        // =====================================
        // Generate 6-digit OTP
        // =====================================

        const resetCode =
            crypto
                .randomInt(
                    100000,
                    1000000
                )
                .toString();


        // =====================================
        // Hash OTP before storage
        // =====================================

        const hashedCode =
            crypto
                .createHash("sha256")
                .update(resetCode)
                .digest("hex");


        // =====================================
        // OTP expires in 10 minutes
        // =====================================

        const expiresAt =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        user.passwordResetCode =
            hashedCode;

        user.passwordResetExpires =
            expiresAt;

        user.passwordResetVerified =
            false;

        user.passwordResetVerifiedExpires =
            null;


        await user.save();


        // =====================================
        // DEVELOPMENT ONLY
        // =====================================

        console.log(
            `PASSWORD RESET CODE for ${cleanIdentifier}: ${resetCode}`
        );


        const response = {

            success: true,

            message:
                "If an account exists, a password reset code has been sent."
        };


        // =====================================
        // Temporary development response
        // =====================================

        if (
            process.env.NODE_ENV !==
            "production"
        ) {

            response.resetCode =
                resetCode;
        }


        return res.status(200).json(
            response
        );


    } catch (error) {

        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process password reset request"
        });
    }
};



// =====================================================
// Verify Password Reset Code
// POST /api/auth/verify-reset-code
// =====================================================

const verifyResetCode = async (req, res) => {

    try {

        const {
            identifier,
            code
        } = req.body;


        // =====================================
        // Validate
        // =====================================

        if (
            !identifier ||
            !code
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number and reset code are required"
            });
        }


        const cleanIdentifier =
            identifier.trim();

        const cleanCode =
            code.trim();


        const isEmail =
            cleanIdentifier.includes("@");


        let user;


        // =====================================
        // Find user
        // IMPORTANT:
        // Explicitly select ALL reset fields
        // =====================================

        const resetFields =
            "+passwordResetCode " +
            "+passwordResetExpires " +
            "+passwordResetVerified " +
            "+passwordResetVerifiedExpires";


        if (isEmail) {

            user =
                await User.findOne({

                    email:
                        cleanIdentifier.toLowerCase(),

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                }).select(resetFields);


        } else {

            user =
                await User.findOne({

                    phone:
                        cleanIdentifier,

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                }).select(resetFields);
        }


        // =====================================
        // User not found
        // =====================================

        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid or expired reset code"
            });
        }


        // =====================================
        // Check reset code exists
        // =====================================

        if (
            !user.passwordResetCode ||
            !user.passwordResetExpires
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid or expired reset code"
            });
        }


        // =====================================
        // Check expiration
        // =====================================

        if (
            user.passwordResetExpires <
            new Date()
        ) {

            user.passwordResetCode =
                null;

            user.passwordResetExpires =
                null;

            user.passwordResetVerified =
                false;

            user.passwordResetVerifiedExpires =
                null;


            await user.save();


            return res.status(400).json({

                success: false,

                message:
                    "Reset code has expired"
            });
        }


        // =====================================
        // Hash submitted code
        // =====================================

        const hashedCode =
            crypto
                .createHash("sha256")
                .update(cleanCode)
                .digest("hex");


        // =====================================
        // Compare code
        // =====================================

        if (
            hashedCode !==
            user.passwordResetCode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid reset code"
            });
        }


        // =====================================
        // Code verified
        // =====================================

        user.passwordResetVerified =
            true;

        user.passwordResetVerifiedExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Reset code verified successfully"
        });


    } catch (error) {

        console.error(
            "VERIFY RESET CODE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify reset code"
        });
    }
};


// =====================================================
// Reset Password
// POST /api/auth/reset-password
// =====================================================

const resetPassword = async (req, res) => {

    try {

        const {
            identifier,
            newPassword,
            confirmPassword
        } = req.body;


        // =====================================
        // Validate
        // =====================================

        if (
            !identifier ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number, new password and confirmation are required"
            });
        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters"
            });
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New passwords do not match"
            });
        }


        const cleanIdentifier =
            identifier.trim();


        const isEmail =
            cleanIdentifier.includes("@");


        let user;


        // =====================================
        // Find user
        // =====================================

        if (isEmail) {

            user =
                await User.findOne({

                    email:
                        cleanIdentifier.toLowerCase(),

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                }).select(
                    "+password +passwordResetCode"
                );


        } else {

            user =
                await User.findOne({

                    phone:
                        cleanIdentifier,

                    hasAccount: true,

                    loginEnabled: true,

                    isActive: true,

                    deleted: false

                }).select(
                    "+password +passwordResetCode"
                );
        }


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Unable to reset password"
            });
        }


        // =====================================
        // Must have verified reset code
        // =====================================

        if (
            !user.passwordResetVerified ||
            !user.passwordResetVerifiedExpires
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Please verify your reset code first"
            });
        }


        // =====================================
        // Check verification expiration
        // =====================================

        if (
            user.passwordResetVerifiedExpires <
            new Date()
        ) {

            user.passwordResetCode =
                null;

            user.passwordResetExpires =
                null;

            user.passwordResetVerified =
                false;

            user.passwordResetVerifiedExpires =
                null;


            await user.save();


            return res.status(403).json({

                success: false,

                message:
                    "Password reset session has expired. Please request a new code."
            });
        }


        // =====================================
        // Prevent same password
        // =====================================

        const samePassword =
            await user.matchPassword(
                newPassword
            );


        if (samePassword) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from your current password"
            });
        }


        // =====================================
        // Set new password
        // =====================================

        user.password =
            newPassword;


        // =====================================
        // Reset first-login requirement
        // =====================================

        user.mustChangePassword =
            false;


        user.loginEnabled =
            true;


        // =====================================
        // Clear reset information
        // =====================================

        user.passwordResetCode =
            null;

        user.passwordResetExpires =
            null;

        user.passwordResetVerified =
            false;

        user.passwordResetVerifiedExpires =
            null;


        await user.save();


        // =====================================
        // Generate fresh token
        // =====================================

        const token =
            generateToken(user);


        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully",

            token,

            user: {

                id:
                    user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email || null,

                phone:
                    user.phone || null,

                role:
                    user.role,

                mustChangePassword:
                    user.mustChangePassword
            }
        });


    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to reset password"
        });
    }
};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    registerUser,

    loginUser,

    createMemberAccount,

    changePassword,

    forgotPassword,

    verifyResetCode,

    resetPassword
};