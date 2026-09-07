const User = require("../models/User");

const generateToken = require("../utils/generateToken");


// =====================================================
// REGISTER NEW USER ACCOUNT
// POST /api/auth/register
//
// Email OR phone can be used.
// Email is optional.
// Phone is optional.
// At least one must be provided for an account.
// =====================================================

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


        // =================================================
        // CLEAN INPUT
        // =================================================

        const cleanFirstName =
            firstName?.trim();

        const cleanLastName =
            lastName?.trim();

        const cleanEmail =
            email
                ? email.trim().toLowerCase()
                : undefined;

        const cleanPhone =
            phone
                ? phone.trim()
                : undefined;


        // =================================================
        // REQUIRED FIELDS
        // =================================================

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


        // =================================================
        // EMAIL / PHONE REQUIREMENT
        //
        // A user with an account must have at least
        // one login identifier.
        // =================================================

        if (
            !cleanEmail &&
            !cleanPhone
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or phone number is required"

            });

        }


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        // =================================================
        // CHECK EMAIL
        // Only check if email was provided.
        // =================================================

        if (cleanEmail) {

            const emailExists =
                await User.findOne({
                    email: cleanEmail
                });


            if (emailExists) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email already exists"

                });

            }

        }


        // =================================================
        // CHECK PHONE
        // Only check if phone was provided.
        // =================================================

        if (cleanPhone) {

            const phoneExists =
                await User.findOne({
                    phone: cleanPhone
                });


            if (phoneExists) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Phone already exists"

                });

            }

        }


        // =================================================
        // CREATE USER
        // =================================================

        const user =
            await User.create({

                firstName:
                    cleanFirstName,

                lastName:
                    cleanLastName,

                email:
                    cleanEmail,

                phone:
                    cleanPhone,

                password,

                gender,

                dateOfBirth:
                    dateOfBirth || null,


                // =========================================
                // ACCOUNT
                // =========================================

                hasAccount: true,

                loginEnabled: true,

                mustChangePassword: false,

                accountCreatedAt:
                    new Date(),


                // =========================================
                // CHURCH DEFAULTS
                // =========================================

                role: "Member",

                membershipType: "Member",

                status: "Active",

                isActive: true,

                registrationSource: "Online"

            });


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

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

    }
    catch (error) {

        console.error(
            "REGISTER USER ERROR:",
            error
        );


        // =================================================
        // DUPLICATE KEY ERROR
        // =================================================

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



// =====================================================
// CREATE LOGIN ACCOUNT FOR EXISTING MEMBER
// POST /api/auth/create-account/:id
//
// Existing members may not have an email.
// They can still receive an account using their phone.
// =====================================================

const createMemberAccount =
    async (req, res) => {

        try {

            const member =
                await User.findById(
                    req.params.id
                );


            // =================================================
            // MEMBER NOT FOUND
            // =================================================

            if (!member) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Member not found"

                });

            }


            // =================================================
            // CHILDREN SHOULD NOT HAVE LOGIN ACCOUNTS
            // =================================================

            if (member.isChild) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Children cannot have independent login accounts"

                });

            }


            // =================================================
            // ALREADY HAS ACCOUNT
            // =================================================

            if (member.hasAccount) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Member already has an account"

                });

            }


            // =================================================
            // CHECK LOGIN IDENTIFIER
            //
            // Existing member should have either:
            // email OR phone.
            // =================================================

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


            // =================================================
            // GET PASSWORD
            // =================================================

            let generatedPassword =
                req.body.password;


            // =================================================
            // GENERATE TEMPORARY PASSWORD
            // =================================================

            if (!generatedPassword) {

                generatedPassword =

                    Math.random()
                        .toString(36)
                        .slice(2, 8)

                    +

                    Math.floor(
                        Math.random() * 100
                    );

            }


            // =================================================
            // VALIDATE PASSWORD
            // =================================================

            if (
                generatedPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            // =================================================
            // CREATE ACCOUNT
            // =================================================

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


            // =================================================
            // RESPONSE
            // =================================================

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

        }
        catch (error) {

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



// =====================================================
// LOGIN
// POST /api/auth/login
//
// The identifier can be:
// - Email
// - Phone number
//
// Example:
//
// {
//     "identifier": "john@gmail.com",
//     "password": "123456"
// }
//
// OR:
//
// {
//     "identifier": "0241234567",
//     "password": "123456"
// }
// =====================================================

const loginUser =
    async (req, res) => {

        try {

            const {
                identifier,
                password
            } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

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


            // =================================================
            // CLEAN IDENTIFIER
            // =================================================

            const cleanIdentifier =
                identifier.trim();


            // =================================================
            // DETERMINE EMAIL OR PHONE
            // =================================================

            const isEmail =
                cleanIdentifier.includes("@");


            // =================================================
            // FIND USER
            // =================================================

            let user;


            if (isEmail) {

                user =
                    await User.findOne({

                        email:
                            cleanIdentifier.toLowerCase(),

                        hasAccount: true,

                        loginEnabled: true

                    })
                        .select("+password");

            }
            else {

                user =
                    await User.findOne({

                        phone:
                            cleanIdentifier,

                        hasAccount: true,

                        loginEnabled: true

                    })
                        .select("+password");

            }


            // =================================================
            // USER NOT FOUND
            // =================================================

            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email/phone or password"

                });

            }


            // =================================================
            // CHECK PASSWORD
            // =================================================

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


            // =================================================
            // UPDATE LAST LOGIN
            // =================================================

            user.lastLogin =
                new Date();

            await user.save();


            // =================================================
            // RETURN LOGIN RESPONSE
            // =================================================

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

        }
        catch (error) {

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



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    registerUser,

    loginUser,

    createMemberAccount

};