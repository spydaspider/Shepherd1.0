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

        // Check email only when supplied
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

        // Check phone only when supplied
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
            message: "Account created successfully",

            token: generateToken(user),

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || null,
                phone: user.phone || null,
                role: user.role,
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
            message: error.message
        });
    }
};


// =====================================
// Admin Creates Login Account
// =====================================

const createMemberAccount = async (req, res) => {
    try {
        const member = await User.findById(
            req.params.id
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
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

        if (!member.email && !member.phone) {
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

        member.password = generatedPassword;

        member.hasAccount = true;
        member.loginEnabled = true;

        // Force password change at first login
        member.mustChangePassword = true;

        member.accountCreatedAt =
            new Date();

        member.accountCreatedBy =
            req.user._id;

        member.registrationSource =
            "Admin";

        member.isVerified = false;
        member.phoneVerified = false;

        await member.save();

        return res.status(200).json({
            success: true,
            message:
                "Login account created successfully",

            temporaryPassword:
                generatedPassword,

            member: {
                id: member._id,
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
            message: error.message
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

        if (!identifier || !password) {
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

        if (isEmail) {
            user = await User.findOne({
                email:
                    cleanIdentifier.toLowerCase(),
                hasAccount: true,
                loginEnabled: true
            }).select("+password");

        } else {
            user = await User.findOne({
                phone: cleanIdentifier,
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

        user.lastLogin = new Date();

        await user.save();

        return res.json({
            success: true,
            message: "Login successful",

            token: generateToken(user),

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || null,
                phone: user.phone || null,
                role: user.role,
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
            message: error.message
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


        // =====================================
        // Check new password length
        // =====================================

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters"
            });
        }


        // =====================================
        // Check password confirmation
        // =====================================

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

        const user = await User.findById(
            req.user._id
        ).select("+password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // =====================================
        // Make sure account can log in
        // =====================================

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

        user.password = newPassword;

        // Password has now been changed
        user.mustChangePassword = false;

        user.loginEnabled = true;

        await user.save();


        // =====================================
        // Return fresh token
        // =====================================

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully",

            token: generateToken(user),

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || null,
                phone: user.phone || null,
                role: user.role,
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
            message: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    createMemberAccount,
    changePassword
};