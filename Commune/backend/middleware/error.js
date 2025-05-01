const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

  
  console.error(err);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export default errorHandler; 