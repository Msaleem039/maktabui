import Invoice from "../models/Invoice";
import Parent from "../models/Parent";
import Student from "../models/Student";


export const getAllInvoices = async (req) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "parent",
        select: "fullName email phone",
      })
      .populate({
        path: "student",
        select: "studentName email",
      })
      .sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        success: true,
        count: invoices.length,
        invoices,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching invoices:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Invoice fetch error: ${error.message}`,
      }),
      { status: 500 }
    );
  }
};

export const getInvoicesStats = async (req) => {
  try {
    let { 
      page = 1, 
      limit = 10, 
      search = "", 
      fromDate, 
      toDate, 
      status,
      unpaidPage = 1,
      unpaidLimit = 10,
      unpaidSearch = "",
      unpaidStatus,
      date,
      filterBy
    } = await req.json();

    page = Number(page);
    limit = Number(limit);
    unpaidPage = Number(unpaidPage);
    unpaidLimit = Number(unpaidLimit);

    // MAIN FILTER
    const filter = {};

    // --- DATE FILTERS ---
    if (date) {
      filter.createdAt = {};
      const now = new Date();

      if (date === "this_month") {
        filter.createdAt.$gte = new Date(now.getFullYear(), now.getMonth(), 1);
        filter.createdAt.$lte = now;
      } else if (date === "last_month") {
        filter.createdAt.$gte = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filter.createdAt.$lte = new Date(now.getFullYear(), now.getMonth(), 0);
      } else if (date === "this_year") {
        filter.createdAt.$gte = new Date(now.getFullYear(), 0, 1);
        filter.createdAt.$lte = now;
      }
    }

    if (fromDate || toDate) {
      filter.createdAt = filter.createdAt || {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // ---- STATUS FILTER ----
    if (status) {
      if (status === "paid") filter.status = "paid";
      if (status === "unpaid") filter.status = { $in: ["pending", "overdue"] };
    }

    // ---- MAIN SEARCH FILTER ----
    if (search.trim() !== "") {
      const matchingParents = await Parent.find({
        fullName: { $regex: search, $options: "i" }
      }).select("_id");

      const matchingStudents = await Student.find({
        studentName: { $regex: search, $options: "i" }
      }).select("_id");

      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { parent: { $in: matchingParents.map(p => p._id) } },
        { student: { $in: matchingStudents.map(s => s._id) } }
      ];
    }

    // ---- FETCH ALL INVOICES FOR STATS ----
    const allInvoices = await Invoice.find(filter)
      .populate({ path: "parent", select: "fullName email phone" })
      .populate({ path: "student", select: "studentName email" });

    // ---- STATS ----
    const totalAmount = allInvoices.reduce((s, inv) => s + inv.totalAmount, 0);
    const totalPaidAmount = allInvoices.reduce((s, inv) => s + inv.paidAmount, 0);
    const totalUnpaidAmount = totalAmount - totalPaidAmount;

    const monthlyData = {
      paid: Array(12).fill(0),
      unpaid: Array(12).fill(0)
    };

    allInvoices.forEach(inv => {
      const month = new Date(inv.createdAt).getMonth();
      if (inv.status === "paid") {
        monthlyData.paid[month] += inv.paidAmount;
      } else {
        monthlyData.unpaid[month] += (inv.totalAmount - inv.paidAmount);
      }
    });

    // ---- PAYMENT METHOD STATS (Placeholder) ----
    const paymentMethods = {
      stripe: allInvoices.filter(inv => inv.paidAmount > 0).length * 0.7,
      other: allInvoices.filter(inv => inv.paidAmount > 0).length * 0.3
    };

    // ===============================
    //     UNPAID FILTER (FIXED)
    // ===============================
    const unpaidFilter = {
      ...filter,
      $or: [
        { status: "pending" },
        { status: "overdue" },
        {
          // partially paid
          $expr: {
            $and: [
              { $gt: ["$paidAmount", 0] },
              { $lt: ["$paidAmount", "$totalAmount"] }
            ]
          }
        }
      ]
    };

    // ---- UNPAID SEARCH ----
    if (unpaidSearch.trim() !== "") {
      const matchingParents = await Parent.find({
        $or: [
          { fullName: { $regex: unpaidSearch, $options: "i" } },
          { phone: { $regex: unpaidSearch, $options: "i" } }
        ]
      }).select("_id");

      unpaidFilter.$or.push(
        { invoiceNumber: { $regex: unpaidSearch, $options: "i" } },
        { parent: { $in: matchingParents.map(p => p._id) } }
      );
    }

    // ---- UNPAID STATUS FILTER ----
    if (unpaidStatus) {
      delete unpaidFilter.status; // avoid conflict
      delete unpaidFilter.$or;    // remove OR so we can apply exact match

      if (unpaidStatus === "pending") {
        unpaidFilter.status = "pending";
      } else if (unpaidStatus === "overdue") {
        unpaidFilter.status = "overdue";
      } else if (unpaidStatus === "partially_paid") {
        unpaidFilter.$expr = {
          $and: [
            { $gt: ["$paidAmount", 0] },
            { $lt: ["$paidAmount", "$totalAmount"] }
          ]
        };
      }
    }

    // ---- FETCH UNPAID INVOICES ----
    const unpaidInvoices = await Invoice.find(unpaidFilter)
      .populate({ path: "parent", select: "fullName email phone" })
      .populate({ path: "student", select: "studentName email" })
      .sort({ createdAt: -1 })
      .skip((unpaidPage - 1) * unpaidLimit)
      .limit(unpaidLimit);

    const totalUnpaidInvoicesCount = await Invoice.countDocuments(unpaidFilter);

    // ---- FETCH PAGINATED MAIN INVOICES ----
    const invoices = await Invoice.find(filter)
      .populate({ path: "parent", select: "fullName email phone" })
      .populate({ path: "student", select: "studentName email" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalInvoicesCount = await Invoice.countDocuments(filter);

    const formatInvoices = (arr) =>
      arr.map((inv) => ({
        ...inv.toObject(),
        items: inv.items.map(item => ({
          ...item,
          amount: item.amount
        }))
      }));

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalInvoices: allInvoices.length,
          totalAmount,
          totalPaidAmount,
          totalUnpaidAmount,
          monthlyPaid: monthlyData.paid,
          monthlyUnpaid: monthlyData.unpaid,
          stripePayments: paymentMethods.stripe,
          otherPayments: paymentMethods.other
        },
        unpaidInvoices: formatInvoices(unpaidInvoices),
        unpaidPagination: {
          page: unpaidPage,
          limit: unpaidLimit,
          totalUnpaidCount: totalUnpaidInvoicesCount,
          totalUnpaidPages: Math.ceil(totalUnpaidInvoicesCount / unpaidLimit),
        },
        pagination: {
          page,
          limit,
          totalInvoicesCount,
          totalPages: Math.ceil(totalInvoicesCount / limit),
        },
        invoices: formatInvoices(invoices)
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Invoice stats error: ${error.message}`,
      }),
      { status: 500 }
    );
  }
};

export const createInvoice = async (req) => {
  try {
    const body = await req.json(); 

    const {
      parentId,
      studentId,
      items,
      totalAmount,
      dueDate,
      notes
    } = body;

    const invoice = new Invoice({
      parent: parentId,
      student: studentId,
      invoiceNumber: `INV-${Date.now()}`,
      items,
      totalAmount,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes
    });

    await invoice.save();

    return new Response(
      JSON.stringify({
        message: "Invoice created successfully",
        invoice,
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating invoice:", error);

    return new Response(
      JSON.stringify({
        message: error.message || "Failed to create invoice",
      }),
      { status: 500 }
    );
  }
};

