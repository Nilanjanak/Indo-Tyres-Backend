import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Tyre } from "../../Model/Tyres/Tyres.js";
import { Enquiry } from "../../Model/Enquiry/Enquiry.js";
dotenv.config();
// ============================
// Create new enquiry
// ============================
export const createEnquiry = async (req, res)=>{
    const session = await mongoose.startSession();
    try{
        const tyreId = req.params.id;
        const {name, email,  enquirie} = req.body;
        if(!name||name.trim() === "" 
        || !email||email.trim()===""
        ||!enquirie || enquirie.trim()===""){
             return res.status(400).json({ error: "Please fill all fields" });
        }
    const TYRE = await Tyre.findById(tyreId)
    if(!TYRE){
         return res.status(404).json({ error: "property not found" });
    }
    let enquiry = new Enquiry({
        name,
        email,
        enquirie,
        product:tyreId,
    });
    session.startTransaction();
    await enquiry.save({ session });
    TYRE.enquiries.push(enquiry._id);
    await TYRE.save({session});
    await session.commitTransaction();
    session.endSession();
    if(!enquiry){
        return res.status(500).json({
        error: "Enquiry creation failed",
      });
    }
            // Email configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${email}`,
      to: "realstate694@gmail.com",
      subject: `New Tyre Enquiry Received from ${name}`,
      html: `
        <h3>Customer Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Enquiry:</strong> ${enquirie}</p>

        <hr />

        <h3>Property Details</h3>
        <p><strong>Name:</strong> ${TYRE.name}</p>
        <p><strong>Brand:</strong> ${TYRE.brand}</p>
        <p><strong>Catagory:</strong> $${TYRE.category}</p>
        <p><strong>Description:</strong> $${TYRE.description}</p>
        <p><strong>Size:</strong> $${TYRE.size}</p>
        <p><strong>Price:</strong> $${TYRE.price}</p>
        <p><strong>Discount:</strong> $${TYRE.discount} sq ft</p>
        ${
          TYRE.image?.length
            ? `<p><strong>Images:</strong><br/>${TYRE.image
                .map(
                  (img) => `<img src="${img}" width="150" style="margin:5px"/>`
                )
                .join("")}</p>`
            : "<p><strong>Images:</strong> No Images </p>"
        }
         </p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Query created and email sent successfully",
      enquirie,
    });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}